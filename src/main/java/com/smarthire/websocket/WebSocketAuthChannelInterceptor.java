package com.smarthire.websocket;

import com.smarthire.auth.JwtService;
import com.smarthire.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {
    private final JwtService jwtService;
    private final UserService userService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String header = accessor.getFirstNativeHeader("Authorization");
            if (header != null && header.startsWith("Bearer ")) {
                String token = header.substring(7);
                var user = userService.loadUserByUsername(jwtService.username(token));
                if (jwtService.valid(token, user)) {
                    var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    accessor.setUser(authentication);
                }
            }
        }
        if (accessor.getUser() instanceof UsernamePasswordAuthenticationToken authentication) {
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        return message;
    }
}
