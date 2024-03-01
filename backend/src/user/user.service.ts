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

    async createUser(dataToStore)
    {
        const queryRunner = this.dataSource.createQueryRunner();
        
        await queryRunner.startTransaction();

        const user = new User;
        user.full_name = dataToStore.full_name;
        user.email = dataToStore.email;
        user.date_of_birth = new Date(dataToStore.date_of_birth);
        user.password = dataToStore.password;

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

    async delUserById(listUserId)
    {
        await this.dataSource
                  .createQueryBuilder()
                  .update(User)
                  .set({deleted_at: new Date()})
                  .where("id in (:id)", {id:listUserId})
                  .execute();
    }

    dateStringFormatter(strDate,dateFormat,formatToConvert)
    {
        let arrDate = strDate.split("-");
        if(dateFormat === "YYYY-M-D")
        {
            if(formatToConvert === "D-M-YYYY")
            {
                arrDate = arrDate.reverse();
                return `${arrDate[0]}-${arrDate[1]}-${arrDate[2]}`
            }
        }
    }
}