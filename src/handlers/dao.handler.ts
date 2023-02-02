import * as ss58 from "@subsquid/ss58";
import { EventItem } from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import { DaoDaoRegisteredEvent } from "../types/events";
import { Ctx } from "../processor";
import { NETWORK_PREFIX } from "../constants";
import { decodeHex } from "@subsquid/substrate-processor";
import { Account, Dao, DaoPolicy, Token } from "../model";
import { In } from "typeorm";

interface CreateDaoExtrinsicArgs {
  council: string[];
  data: string;
  technicalCommittee: string[];
}

interface CreateDaoData {
  name: string;
  purpose: string;
  metadata: string;
  policy: {
    proposal_period: number;
    approve_origin: { type: string; proportion: [number] };
  };
  token: {
    token_id: number;
    initial_balance: string;
    metadata: { name: string; symbol: string; decimals: number };
  };
}

function getAccount(m: Map<string, Account>, id: string): Account {
  let acc = m.get(id);
  if (acc == null) {
    acc = new Account();
    acc.id = id;
    m.set(id, acc);
  }
  return acc;
}

export async function daoHandler(
  ctx: Ctx,
  _createDaoEvents: EventItem<
    "Dao.DaoRegistered",
    { readonly event: { readonly args: true; readonly call: true } }
  >[]
) {
  const daos: Dao[] = [];
  const policies: DaoPolicy[] = [];
  const tokens: Token[] = [];
  let accountIds = new Set<string>();

  for (const _daoEvent of _createDaoEvents) {
    const e = new DaoDaoRegisteredEvent(ctx, _daoEvent.event);

    if (e.isV100) {
      const [_, encodedFounder] = e.asV100;
      const founder = ss58.codec(NETWORK_PREFIX).encode(encodedFounder);
      accountIds.add(founder);
    }
  }

  const accounts = await ctx.store
    .findBy(Account, { id: In([...accountIds]) })
    .then((accounts) => new Map(accounts.map((a) => [a.id, a])));

  for (const _daoEvent of _createDaoEvents) {
    const e = new DaoDaoRegisteredEvent(ctx, _daoEvent.event);

    if (e.isV100) {
      const [daoId, encodedFounder] = e.asV100;
      const founder = ss58.codec(NETWORK_PREFIX).encode(encodedFounder);
      const extrinsicData: CreateDaoExtrinsicArgs = _daoEvent.event.call?.args;
      const { council, technicalCommittee, data } = extrinsicData;
      const decodedData: CreateDaoData = JSON.parse(decodeHex(data).toString());

      const founderAccount = getAccount(accounts, founder);

      const token = new Token({
        id: decodedData.token.token_id.toString(),
        name: decodedData.token.metadata.name,
        symbol: decodedData.token.metadata.symbol,
        decimals: decodedData.token.metadata.decimals,
        balance: BigInt(decodedData.token.initial_balance),
      });

      const policy = new DaoPolicy({
        id: daoId.toString(),
        proposalPeriod: decodedData.policy.proposal_period,
        approveOriginProportion: decodedData.policy.approve_origin.proportion,
        approveOriginType: decodedData.policy.approve_origin.type,
      });

      const dao = new Dao({
        id: daoId.toString(),
        founder: founderAccount,
        council: council,
        technicalCommittee: technicalCommittee,
        name: decodedData.name,
        purpose: decodedData.purpose,
        metadata: decodedData.metadata,
        token: token,
        policy: policy,
      });
      tokens.push(token);
      policies.push(policy);
      daos.push(dao);
    } else {
      throw new Error("Unsupported dao spec");
    }
  }
  return { daos, policies, tokens, accounts };
}
