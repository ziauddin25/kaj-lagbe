import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<any>;
    update(id: string, data: {
        name?: string;
        phone?: string;
        avatar?: string;
    }): Promise<any>;
}
