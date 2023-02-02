module.exports = class Data1675371546717 {
    name = 'Data1675371546717'

    async up(db) {
        await db.query(`CREATE TABLE "token" ("id" character varying NOT NULL, "name" text NOT NULL, "symbol" text NOT NULL, "decimals" integer, "balance" numeric NOT NULL, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "dao_policy" ("id" character varying NOT NULL, "proposal_period" integer NOT NULL, "approve_origin_type" text NOT NULL, "approve_origin_proportion" integer array, CONSTRAINT "PK_97271186a6f3c8f1413ed955678" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "dao" ("id" character varying NOT NULL, "council" text array, "technical_committee" text array, "name" text NOT NULL, "purpose" text NOT NULL, "metadata" text NOT NULL, "founder_id" character varying, "token_id" character varying, "policy_id" character varying, CONSTRAINT "PK_4daffbc13cc700ca118098230a9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_9bcc51bcee2ef61d3eb365e998" ON "dao" ("founder_id") `)
        await db.query(`CREATE INDEX "IDX_1dd20532e986bd734239fb1b16" ON "dao" ("token_id") `)
        await db.query(`CREATE INDEX "IDX_97271186a6f3c8f1413ed95567" ON "dao" ("policy_id") `)
        await db.query(`ALTER TABLE "transfer" ALTER COLUMN "fee" SET NOT NULL`)
        await db.query(`ALTER TABLE "dao" ADD CONSTRAINT "FK_9bcc51bcee2ef61d3eb365e998e" FOREIGN KEY ("founder_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "dao" ADD CONSTRAINT "FK_1dd20532e986bd734239fb1b16b" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "dao" ADD CONSTRAINT "FK_97271186a6f3c8f1413ed955678" FOREIGN KEY ("policy_id") REFERENCES "dao_policy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "token"`)
        await db.query(`DROP TABLE "dao_policy"`)
        await db.query(`DROP TABLE "dao"`)
        await db.query(`DROP INDEX "public"."IDX_9bcc51bcee2ef61d3eb365e998"`)
        await db.query(`DROP INDEX "public"."IDX_1dd20532e986bd734239fb1b16"`)
        await db.query(`DROP INDEX "public"."IDX_97271186a6f3c8f1413ed95567"`)
        await db.query(`ALTER TABLE "transfer" ALTER COLUMN "fee" DROP NOT NULL`)
        await db.query(`ALTER TABLE "dao" DROP CONSTRAINT "FK_9bcc51bcee2ef61d3eb365e998e"`)
        await db.query(`ALTER TABLE "dao" DROP CONSTRAINT "FK_1dd20532e986bd734239fb1b16b"`)
        await db.query(`ALTER TABLE "dao" DROP CONSTRAINT "FK_97271186a6f3c8f1413ed955678"`)
    }
}
