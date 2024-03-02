import { Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import moment from 'moment';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('getUserByFilter')
    async getUserByFilter(@Req() request)
    {
        const listAllUsers = (await this.userService.generalQuery()).orderBy("full_name","ASC").getMany();
        return (await listAllUsers).map(user=>{
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
    }


    @Post('createUser')
    async createUser(@Req() request){
        return await this.userService.createUser(request.body);
    }

    @Post('delUserById')
    async delUserById(@Req() request)
    {
        console.log(request.body);
        return await this.userService.delUserById(request.body);
    }

    @Post("updateUserById")
    async updateUserById(@Req() request)
    {
        return await this.userService.updatedUserBydId(request.body);
    }
}