module.exports = class Data1681121373673 {
    name = 'Data1681121373673'

    async up(db) {
        await db.query(`ALTER TABLE "council_proposal" ADD "executed" boolean`)
        await db.query(`ALTER TABLE "council_proposal" ADD "reason" text`)
        await db.query(`ALTER TABLE "eth_governance_proposal" ADD "executed" boolean`)
        await db.query(`ALTER TABLE "eth_governance_proposal" ADD "reason" text`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "council_proposal" DROP COLUMN "executed"`)
        await db.query(`ALTER TABLE "council_proposal" DROP COLUMN "reason"`)
        await db.query(`ALTER TABLE "eth_governance_proposal" DROP COLUMN "executed"`)
        await db.query(`ALTER TABLE "eth_governance_proposal" DROP COLUMN "reason"`)
    }
}
