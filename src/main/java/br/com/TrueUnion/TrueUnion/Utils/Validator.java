package br.com.TrueUnion.TrueUnion.Utils;

public class Validator {
	
	public static boolean passwordValidator(String password) {
		char[] arrayPassword = password.toCharArray();
		boolean hasAlphabeticCharacter = false;
		boolean hasNumber = false;
		for(char e:arrayPassword) {
			if(Character.isAlphabetic(e)) {
				hasAlphabeticCharacter = true;
			}
			if(Character.isDigit(e)) {
				hasNumber = true;
			}
		}
		if(hasAlphabeticCharacter && hasNumber) {
			return true;
		}else {
			return false;
		}
	}
}
