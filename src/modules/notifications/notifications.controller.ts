import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ROLES } from 'src/common/enums';
import { RequestPayload } from 'src/common/types';
import { HasRoles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { NotificationCreationDTO } from './dto/notificationCreate.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@ApiTags('Notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @HasRoles(ROLES.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createNotification(@Request() req: RequestPayload, @Body() { message }: NotificationCreationDTO) {
    return this.notificationsService.createNotification(req.userId, message);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getUserNotifications(@Request() req: RequestPayload) {
    return this.notificationsService.getUserNotifications(req.userId);
  }

  @Get('/:notificationId')
  @UseGuards(AuthGuard)
  async getUserNotificationById(@Param('notificationId') notificationId: string) {
    return this.notificationsService.getNotificationById(notificationId);
  }

  @Patch('/:notificationId')
  @UseGuards(AuthGuard)
  async markNotificationAsRead(@Request() req: RequestPayload, @Param('notificationId') notificationId: string) {
    return this.notificationsService.markNotificationAsRead(req.userId, notificationId);
  }

  @Patch('/:notificationId/unread')
  @UseGuards(AuthGuard)
  async markNotificationAsUnread(@Request() req: RequestPayload, @Param('notificationId') notificationId: string) {
    return this.notificationsService.markNotificationAsUnread(req.userId, notificationId);
  }

  @Patch('/:notificationId/message')
  @UseGuards(AuthGuard)
  @HasRoles(ROLES.ADMIN)
  async updateNotificationMessage(
    @Param('notificationId') notificationId: string,
    @Body() { message }: NotificationCreationDTO
  ) {
    return this.notificationsService.updateNotificationMessage(notificationId, message);
  }

  @Delete('/:notificationId')
  @UseGuards(AuthGuard)
  @HasRoles(ROLES.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeNotification(@Param('notificationId') notificationId: string) {
    return this.notificationsService.removeNotification(notificationId);
  }
}
