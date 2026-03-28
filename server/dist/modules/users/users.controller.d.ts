import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findById(id: string): Promise<any>;
    update(id: string, body: {
        name?: string;
        phone?: string;
        avatar?: string;
    }): Promise<any>;
}
