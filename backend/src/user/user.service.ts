import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(private dataSource: DataSource) {}

    async generalQuery()
    {
        return await this.dataSource
                         .getRepository(User)
                         .createQueryBuilder("user")
                         .where("user.deleted_at IS NULL");
    }

    async createUser()
    {
        const queryRunner = this.dataSource.createQueryRunner();
        
        await queryRunner.startTransaction();

        const user = new User;
        user.full_name = "Testing";
        user.email = "dsf";
        user.date_of_birth = new Date;
        user.password = "sdfhdsf";

        try
        {
            await queryRunner.manager.save(user);
            await queryRunner.commitTransaction()
        }
        catch(err)
        {
            console.log(err);
            await queryRunner.rollbackTransaction()
        }
        finally
        {
            await queryRunner.release()
        }
    }

    async updateUserById()
    {
        await this.dataSource
                  .createQueryBuilder()
                  .update(User)
                  .set({first_name: "Ethan",
                            last_name: "Lee",
                        })
                  .where("id = :id", {id:1})
                  .execute();
                
    }
}