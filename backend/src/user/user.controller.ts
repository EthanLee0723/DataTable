import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

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