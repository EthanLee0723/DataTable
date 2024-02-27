import { Controller, Get, Post } from '@nestjs/common';

@Controller('testing')
export class TestingController {
    @Post()
    create(): string {
        return 'This action adds a new cat';
    }

    @Get()
    findAll(): string {
        return "testing";
    }
}