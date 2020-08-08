import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Comments1596668525927 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(new Table({
            name: 'comments',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                },
                {
                    name: 'comment',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'user',
                    type: 'uuid',
                },
                {
                    name: 'post',
                    type: 'uuid',
                },
            ],

            foreignKeys:
                [
                    {
                        name: 'user',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['user'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE'
                    },
                    {
                        name: 'post',
                        referencedTableName: 'photos',
                        referencedColumnNames: ['id'],
                        columnNames: ['post'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE'
                    }
                ],

        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('comments');

    }

}
