package br.com.SmartPDV.SmartPDV.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class HashSenha {

	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
