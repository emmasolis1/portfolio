// Code by Blopa Scandium
// October, 2020
#ifndef STRING_FUNCTIONS
#define STRING_FUNCTIONS
namespace String{
	template <class T> unsigned long long int length(const T* array){
		unsigned long long int result=-1;
		while(array[++result]);
		return result;
	}
	template <class S,class T> unsigned long long int copy(S* dest,const T* source){
		unsigned long long int offset=0;
		while(source[offset]){dest[offset]=source[offset]; offset++;}
		dest[offset]=0;
		return offset;
	}
	template <class S,class T> unsigned long long int copy(S* dest,const T* source,const unsigned long long int maxCopy){
		unsigned long long int offset=0;
		while(source[offset] && offset<maxCopy){dest[offset]=source[offset]; offset++;}
		dest[offset]=0;
		return offset;
	}
	template <class S,class T> unsigned long long int concat(S* dest,const T* source,const unsigned long long int startingPos=-1){
		unsigned long long int offset=0,srcOffset=0;
		while(dest[offset] && offset<startingPos){offset++;}
		while(source[srcOffset]){dest[offset++]=source[srcOffset++];}
		dest[offset]=0;
		return offset;
	}
	template <class S,class T> inline unsigned long long int append(S* dest,const T* source,const unsigned long long int startingPos=-1){ return concat(dest,source,startingPos); }
	template <class S,class T> long long int compare(const S* source1,const T* source2){
		unsigned long long int offset=0;
		while(source1[offset] && source1[offset]==source2[offset]){offset++;}
		return source2[offset]-source1[offset];
	}
	template <class S,class T> bool startsWith(const S* source,const T* item){
		unsigned long long int offset=0;
		while(item[offset] && item[offset]==source[offset]){offset++;}
		return !item[offset];
	}
	template <class S,class T> bool endsWith(const S* source,const T* item){
		unsigned long long int offset = length(source)-length(item),itemOffset=0;
		while(item[itemOffset] && item[itemOffset]==source[offset]){offset++; itemOffset++;}
		return !item[itemOffset];
	}
	template <class S,class T> unsigned long long int count(const S* source,const T* item){
		unsigned long long int result=0,offset=0;
		while(source[offset]){
			if(startsWith(&(source[offset]),item)){result++;}
			offset++;
		}
		return result;
	}
	template <class S,class T> long long int findFirst(const S* source,const T* item){
		long long int offset=0;
		while(source[offset] && !startsWith(&(source[offset]),item)){offset++;}
		return source[offset]?offset:-1;
	}
	template <class S,class T> long long int findLast(const S* source,const T* item){
		long long int offset = length(source)-length(item);
		while(offset>=0 && source[offset] && !startsWith(&(source[offset]),item)){offset--;}
		return offset;
	}
	template <class S,class T> long long int insert(S* source,const T* item,unsigned long long int position){
		unsigned long long int len = length(source), itemLength = length(item);
		if(position<len){
			unsigned long long int i = len;
			do{
				--i;
				source[i+itemLength] = source[i];
			}while(i>position);
		}else{ position = len; }
		source[len+itemLength] = 0;
		for(unsigned long long int i=0;i<itemLength;i++){ source[i+position] = item[i]; }
		return len+itemLength;
	}
	template <class S,class T> long long int remove(S* source,const T item){
		long long int offset=-1,counter=0;
		while(source[++offset]){
			if(source[offset]==item){ counter++; }else{ source[offset-counter] = source[offset]; }
		}
		source[offset-counter] = 0;
		return offset-counter;
	}
	template <class S,class T> long long int removeString(S* source,const T* item){
		long long int offset=-1,counter=0,itemLength = length(item);
		while(source[++offset]){
			if(startsWith(&(source[offset]),item)){	counter += itemLength; offset+= itemLength-1;	}else{ source[offset-counter] = source[offset]; }
		}
		source[offset-counter] = 0;
		return offset;
	}
	template <class S,class T,class U> void replace(S* source,const T item,const U newItem){
		for(long long int offset=0;source[offset];offset++){
			if(source[offset]==item){ source[offset]=newItem; }
		}
	}
	// TODO: Upgrade this function
	template <class S,class T,class U> long long int replaceString(S* source,const T* item,const U* newItem){
		long long int offset=0,srcLength = length(source),dif = length(newItem) - length(item),i;
		while(offset < srcLength){
			if(startsWith(&(source[offset]),item)){
				if(dif>0){ for(i=srcLength+dif;i>=offset;i--){ source[i]=source[i-dif]; }	}
				if(dif<0){ for(i=offset;i<srcLength;i++){ source[i]=source[i-dif]; }	}
				for(i=0;newItem[i];i++){source[offset+i]=newItem[i];}
				srcLength += dif;
				offset += i;
			}else{
				offset++;
			}
		}
		source[offset] = 0;
		return offset;
	}
	template <class S,class T> unsigned long long int substring(S* dest,const T* source,unsigned long long int startingPos,unsigned long long int length=-1){
        unsigned long long int i;
		for(i=0;i<length && source[i+startingPos];i++){
 		    dest[i]=source[i+startingPos];
 		}
 		dest[i]=0;
 		return i;
 	}
	template <class T> void reverse(T* source){
        unsigned long long int strLength = length(source),halfLength,i;
        T tmp;
        halfLength=(strLength--)>>1;
        for(i=0;i<halfLength;i++){
		    tmp=source[i];
		    source[i]=source[strLength-i];
		    source[strLength-i]=tmp;
 		}
    }
    template <class T,class S> unsigned long long int skipLeading(T* source,const S skip){
		unsigned long long int offset=0,i;
		while(source[offset] && source[offset]==skip){offset++;}
		for(i=0;source[i+offset];i++){ source[i]=source[i+offset]; }
		source[i]=0;
		return i;
	}
	template <class T,class S> unsigned long long int skipLeadingString(T* source,const S* skips){
		unsigned long long int offset=0,i,chars = length(skips);
		bool found=true;
		while(source[offset] && found){
			for(unsigned int j=0;j<chars;j++){
				if(found = (source[offset]==skips[j])){ offset++; break; }
			}
		}
		for(i=0;source[i+offset];i++){ source[i]=source[i+offset]; }
		source[i]=0;
		return i;
	}
	template <class T> long long int toInteger(const T* source,unsigned int base=10,unsigned long long int* endPosition=0){
		unsigned long long int offset=0;
		long long int result=0;
		char upperLim = 'a' + (base-10);
		while(source[offset]=='-'){offset++;}
		while((source[offset]>='0' && source[offset]<='9') || (base>10 && (source[offset]|0x20)>='a' && (source[offset]|0x20)<=upperLim)){
			result *= base;
			if(source[offset]>='0' && source[offset]<='9'){ result += source[offset]-'0'; }
			else{ result += (source[offset]|0x20)-'a'+10; }
			offset++;
		}
		if(source[0]=='-'){ result = -result;}
		if(endPosition){*endPosition += offset;}
		return result;
	}
	template <class T> double toFloat(const T* source,unsigned int base=10,unsigned long long int* endPosition=0){
		unsigned long long int offset=0;
		double result,fraction=1.0/(double)(base),value=1.0;
		char upperLim = 'a' + (base-10);
		while(source[offset]=='-'){offset++;}
		result = toInteger(&(source[offset]),base,&offset);
		if(source[offset++]=='.'){
			while((source[offset]>='0' && source[offset]<='9') || (base>10 && (source[offset]|0x20)>='a' && (source[offset]|0x20)<=upperLim)){
				value *= fraction;
				if(source[offset]>='0' && source[offset]<='9'){ result += (double)(source[offset]-'0')*value; }
				else{ result += (double)((source[offset]|0x20)-'a'+10)*value; }
				offset++;
			}
		}
		if(source[0]=='-'){ result = -result;}
		if(endPosition){*endPosition += offset;}
		return result;
	}
	template <class T,class S> unsigned long long int split(T** tokens,T* source,const S* separator,unsigned long long int limit=-1){
		unsigned long long int totalTokens=0,offset=0,separatorLength = length(separator);
		tokens[totalTokens++] = source;
		while(source[offset] && totalTokens<limit){
			if(startsWith(&(source[offset]),separator)){
				source[offset]=0;
				offset+=separatorLength;
				tokens[totalTokens++] = &(source[offset]);
			}else{
				offset++;
			}
		}
		return totalTokens;
	}
};
#endif
