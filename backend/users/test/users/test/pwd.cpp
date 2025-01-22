#include <iostream>

bool save_pwd(){
	return true;
}

bool generate_pwd(){
	std::string password;
	std::string alphabet = "abcdefghijklmnopqrstuvwxyz";
	for (int i = 0; i < 30; i++){
	int random = rand() % alphabet.size();
	password.append(alphabet, random, 1);
	}
	std::cout << password << "\n";
	return true;
}

bool copy_pwd(){

	return true;
}

bool delete_pwd(){
	return true;
}

int main (){
	int user_opt;	
	std::cout << "Welcome to pwdMyManager, please select your option\n";
	std::cout << "1.save pwd				2.generate pwd				3.copy pwd				4.delete pwd\n";
	std::cin >> user_opt;
	std::string response;
	switch (user_opt) {
		case 1:
			std::cout << "What is the name asociated to that pwd, should be unique!!\n";
			response = save_pwd() == true? "pwd saved" : "error saving pwd";
			break;
		case 2:
			response = generate_pwd() == true? "pwd generated" : "error generating pwd";
			break;
		case 3:
			response = copy_pwd() == true? "pwd copied" : "error copying pwd";
			break;
		case 4:
			response = delete_pwd() == true? "pwd deleted" : "pwd not found";
			break;
	}
	std::cout << response;
}
