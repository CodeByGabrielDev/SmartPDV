package br.com.SmartPDV.SmartPDV.Config;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import br.com.SmartPDV.SmartPDV.Repository.FuncionarioLoja;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final TokenService tokenService;
	private final FuncionarioLoja funcionarioRepository;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String authHeader = request.getHeader("Authorization");
		System.out.println("Auth header: " + authHeader);

		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			System.out.println("No Bearer token, continuing...");
			filterChain.doFilter(request, response);
			return;
		}

		String token = authHeader.substring(7);
		System.out.println("Token extracted");
		
		String login;
		try {
			login = tokenService.getSubject(token);
			System.out.println("Login from token: " + login);
		} catch (Exception e) {
			System.out.println("Token invalid: " + e.getMessage());
			filterChain.doFilter(request, response);
			return;
		}

		if (login != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			UserDetails usuario = funcionarioRepository.findByLogin(login);
			System.out.println("User found: " + (usuario != null));

			if (usuario != null) {
				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(usuario, null,
						usuario.getAuthorities());

				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

				SecurityContextHolder.getContext().setAuthentication(authentication);
				System.out.println("Authentication set!");
			}
		}

		filterChain.doFilter(request, response);
	}
}
