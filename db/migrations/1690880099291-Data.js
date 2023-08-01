module.exports = class Data1690880099291 {
    name = 'Data1690880099291'

    async up(db) {
        await db.query(`ALTER TABLE "council_proposal" ADD "removed" boolean`)
        await db.query(`ALTER TABLE "dao" ADD "removed" boolean`)
        await db.query(`ALTER TABLE "council_vote_history" ADD "removed" boolean`)
        await db.query(`ALTER TABLE "democracy_proposal" ADD "removed" boolean`)
        await db.query(`ALTER TABLE "democracy_second" ADD "removed" boolean`)
        await db.query(`ALTER TABLE "democracy_referendum" ADD "removed" boolean`)
        await db.query(`ALTER TABLE "democracy_delegation" ADD "removed" boolean`)
        await db.query(`ALTER TABLE "bounty" ADD "removed" boolean`)
        await db.query(`ALTER TABLE "eth_governance_proposal" ADD "removed" boolean`)
        await db.query(`ALTER TABLE "eth_governance_vote_history" ADD "removed" boolean`)
        await db.query(`ALTER TABLE "policy" ADD "removed" boolean`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "council_proposal" DROP COLUMN "removed"`)
        await db.query(`ALTER TABLE "dao" DROP COLUMN "removed"`)
        await db.query(`ALTER TABLE "council_vote_history" DROP COLUMN "removed"`)
        await db.query(`ALTER TABLE "democracy_proposal" DROP COLUMN "removed"`)
        await db.query(`ALTER TABLE "democracy_second" DROP COLUMN "removed"`)
        await db.query(`ALTER TABLE "democracy_referendum" DROP COLUMN "removed"`)
        await db.query(`ALTER TABLE "democracy_delegation" DROP COLUMN "removed"`)
        await db.query(`ALTER TABLE "bounty" DROP COLUMN "removed"`)
        await db.query(`ALTER TABLE "eth_governance_proposal" DROP COLUMN "removed"`)
        await db.query(`ALTER TABLE "eth_governance_vote_history" DROP COLUMN "removed"`)
        await db.query(`ALTER TABLE "policy" DROP COLUMN "removed"`)
    }
}
