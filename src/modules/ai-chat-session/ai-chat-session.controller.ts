import { Controller } from "@nestjs/common";
import { AIChatSessionService } from "./ai-chat-session.service";

@Controller('ai_chat_session')
export class AIChatSessionController {
    constructor(
        private readonly aiChatSessionService: AIChatSessionService,
    ) {}

}