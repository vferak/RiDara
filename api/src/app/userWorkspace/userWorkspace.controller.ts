import {
    Controller,
} from '@nestjs/common';
import { UserWorkspaceService } from './userWorkspace.service';

@Controller('userWorkspace')
export class UserWorkspaceController {
    constructor(private readonly userWorkspaceService: UserWorkspaceService) {}
}
