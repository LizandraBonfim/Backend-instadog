import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Photos1596653561761 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: 'photos',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()'
                    }, {
                        name: 'photo',
                        type: 'varchar',
                    }, {
                        name: 'nome',
                        type: 'varchar',
                        isNullable: false
                    }, {
                        name: 'idade',
                        type: 'int',
                    }, {
                        name: 'peso',
                        type: 'int',
                    },

                    {
                        name: 'user',
                        type: 'uuid',
                    },
                    {
                        name: 'acessos',
                        type: 'int',
                        default: 0
                    }
                ],

                foreignKeys: [{
                    name: 'user',
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    columnNames: ['user'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                }]

            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('photos');

    }

}
