module.exports = class Data1681121373673 {
    name = 'Data1681121373673'

    async up(db) {
        await db.query(`ALTER TABLE "council_proposal" ADD "executed" boolean`)
        await db.query(`ALTER TABLE "council_proposal" ADD "reason" text`)
        await db.query(`ALTER TABLE "eth_governance_proposal" ADD "executed" boolean`)
        await db.query(`ALTER TABLE "eth_governance_proposal" ADD "reason" text`)
        await db.query(`ALTER TABLE "eth_governance_vote_history" DROP COLUMN "approved_vote"`)
        await db.query(`ALTER TABLE "eth_governance_proposal" ADD "block_number" numeric NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "council_proposal" DROP COLUMN "executed"`)
        await db.query(`ALTER TABLE "council_proposal" DROP COLUMN "reason"`)
        await db.query(`ALTER TABLE "eth_governance_proposal" DROP COLUMN "executed"`)
        await db.query(`ALTER TABLE "eth_governance_proposal" DROP COLUMN "reason"`)
        await db.query(`ALTER TABLE "eth_governance_vote_history" ADD "approved_vote" boolean NOT NULL`)
        await db.query(`ALTER TABLE "eth_governance_proposal" DROP COLUMN "block_number"`)
    }
}
