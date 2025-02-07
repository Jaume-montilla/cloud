
public class codis {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		char[] lletres = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L','M','N', 'O', 'P', 'Q','R','S','T', 'U', 'V', 'W','X','Y', 'Z'};
		String[] codi_convidats = {"LOI20974", "ICU49260","KET19064", "AIX52429"};
		int idx1 = 3;
		int idx2 = 6;
		for (int i=0; i<codi_convidats.length; i++){
			int suma1 = 0;
			String codi = codi_convidats[i];
			for (int c=idx1; c<idx2; c++){ 
			  int x= Integer.parseInt(codi.substring(c,c+1));
			  suma1 = suma1 + x;    
			}
			int suma2 = 0;
			for (int c=idx2; c<codi.length(); c++){ 
			  int x= Integer.parseInt(codi.substring(c,c+1));
			  suma2+=x;    
			}
			char lletra_correcte = lletres[suma1];
			char lletra= codi.charAt(0);
			boolean valid=false;
			if (lletra_correcte == lletra && suma1==suma2) {
				valid = true;
			}
			if(valid){
                System.out.println("Accés permés");}
			else {
				System.out.println("Accés denegat");
			}
			
			
			
			
			
			
			
		}
		
		

	}

}
