import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import moment from 'moment';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('getAllUser')
    async getAllUser()
    {
        const listAllUsers = (await this.userService.generalQuery()).getMany();
        return (await listAllUsers).map(user=>{
            const dob = new Date(user.date_of_birth);
            const created_at = new Date(user.created_at);
            return {
                id: user.id,
                full_name: user.full_name,
                date_of_birth: `${dob.getDate()}-${dob.getMonth()}-${dob.getFullYear()}`,
                email: user.email,
                created_at: `${created_at.getDate()}-${created_at.getMonth()}-${created_at.getFullYear()} ${created_at.getHours()}:${created_at.getMinutes()}:${created_at.getSeconds()}`
            }
        });
    }


    @Post('createUser')
    async createUser(){
        try {

            return await this.userService.createUser()
            
            return 'Records created successfully!';
        } 
        catch (error) {
            return `Error creating records: ${error.message}`;
        }
    }
}