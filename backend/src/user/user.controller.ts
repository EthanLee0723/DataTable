import { Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import moment from 'moment';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Post('getUserByFilter')
    async getUserByFilter(@Req() request)
    {
        const allSearchableCol = ["full_name","date_of_birth","email","created_at"];
        const tblFilterConditions = request.body.filter;
        let colToSearch = [request.body.search.column];

        let listAllUsers = (await this.userService.generalQuery()).orderBy(request.body.sorting.column,request.body.sorting.order).getMany();

        let userRecords = (await listAllUsers).map(user=>{
            const dob = new Date(user.date_of_birth);
            const created_at = new Date(user.created_at);
            return {
                id: user.id,
                full_name: user.full_name,
                date_of_birth: `${dob.getDate()}-${dob.getMonth()+1}-${dob.getFullYear()}`,
                email: user.email,
                created_at: `${created_at.getDate()}-${created_at.getMonth()+1}-${created_at.getFullYear()} ${created_at.getHours()}:${created_at.getMinutes()}:${created_at.getSeconds()}`
            }
        });

        if(request.body.search.column === "all_columns")
        {
            colToSearch = allSearchableCol;
        }

        userRecords = userRecords.filter((user)=>{
            let matchesFilter = false;
            colToSearch.forEach((val)=>{
                if(!request.body.search.value || user[val].includes(request.body.search.value))
                {
                    matchesFilter = true;
                }
            })
            return matchesFilter;
        })

        userRecords = userRecords.filter((user)=>{
            let matchesDateOfBirthYear = false;
            let matchesCreatedDateYear = false;

            if(!tblFilterConditions.date_of_birth.length && !tblFilterConditions.created_at.length)
            {
                return true;
            }

            if(tblFilterConditions.date_of_birth.length)
            {
                tblFilterConditions.date_of_birth.forEach((val)=>{
                    const userDateOfBirthYear = user.date_of_birth.split("-")[2];
                    if(userDateOfBirthYear === val)
                    {
                        matchesDateOfBirthYear = true;
                    }
                })
            }

            if(tblFilterConditions.created_at.length)
            {
                tblFilterConditions.created_at.forEach((val)=>{
                    const userCreatedAtYear = user.created_at.split("-")[2].split(" ")[0];
                    if(userCreatedAtYear === val)
                    {
                        matchesCreatedDateYear = true;
                    }
                })
            }
            return matchesDateOfBirthYear || matchesCreatedDateYear
        })
        


        return userRecords;
    }


    @Post('createUser')
    async createUser(@Req() request){
        return await this.userService.createUser(request.body);
    }

    @Post('delUserById')
    async delUserById(@Req() request)
    {
        return await this.userService.delUserById(request.body);
    }

    @Post("updateUserById")
    async updateUserById(@Req() request)
    {
        return await this.userService.updatedUserBydId(request.body);
    }
}