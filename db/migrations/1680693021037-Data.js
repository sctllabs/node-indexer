module.exports = class Data1680693021037 {
    name = 'Data1680693021037'

    async up(db) {
        await db.query(`ALTER TABLE "bounty" DROP COLUMN "tag"`)
        await db.query(`ALTER TABLE "council_vote_history" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL`)
        await db.query(`ALTER TABLE "democracy_second" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL`)
        await db.query(`ALTER TABLE "democracy_second" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL`)
        await db.query(`ALTER TABLE "democracy_second" ADD "block_hash" text NOT NULL`)
        await db.query(`ALTER TABLE "democracy_second" ADD "block_num" integer NOT NULL`)
        await db.query(`ALTER TABLE "democracy_referendum" ADD "block_hash" text NOT NULL`)
        await db.query(`ALTER TABLE "democracy_referendum" ADD "block_num" integer NOT NULL`)
        await db.query(`ALTER TABLE "bounty" ADD "native_token" boolean NOT NULL`)
        await db.query(`ALTER TABLE "bounty" ADD "block_hash" text NOT NULL`)
        await db.query(`ALTER TABLE "bounty" ADD "block_num" integer NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "bounty" ADD "tag" character varying(9) NOT NULL`)
        await db.query(`ALTER TABLE "council_vote_history" DROP COLUMN "updated_at"`)
        await db.query(`ALTER TABLE "democracy_second" DROP COLUMN "created_at"`)
        await db.query(`ALTER TABLE "democracy_second" DROP COLUMN "updated_at"`)
        await db.query(`ALTER TABLE "democracy_second" DROP COLUMN "block_hash"`)
        await db.query(`ALTER TABLE "democracy_second" DROP COLUMN "block_num"`)
        await db.query(`ALTER TABLE "democracy_referendum" DROP COLUMN "block_hash"`)
        await db.query(`ALTER TABLE "democracy_referendum" DROP COLUMN "block_num"`)
        await db.query(`ALTER TABLE "bounty" DROP COLUMN "native_token"`)
        await db.query(`ALTER TABLE "bounty" DROP COLUMN "block_hash"`)
        await db.query(`ALTER TABLE "bounty" DROP COLUMN "block_num"`)
    }
}
