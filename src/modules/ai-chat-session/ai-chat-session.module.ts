import { Module } from '@nestjs/common';
import { AIChatSessionController } from './ai-chat-session.controller';
import { AIChatSessionService } from './ai-chat-session.service';

@Module({
    controllers: [AIChatSessionController],
    providers: [AIChatSessionService],
    exports: [AIChatSessionService]
})
export class AiChatSessionModule {}
