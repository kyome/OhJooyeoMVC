package kr.co.ohjooyeo.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

public class WorshipIdGenerator {
	// 형식 : 00-000
	
	// 최초생성
	// 다음 ID 생성 시
	// 연도가 다르면 최초생성 ID 반환 '현재연도-001'
	static DateFormat df = new SimpleDateFormat("yy");
	static String mYear = df.format(Calendar.getInstance().getTime());
	
	static String mWorshipId;
	
	public static String newWorshipId() {
		return mYear + "-" + "001";
	}
	
	public static String nextId(String id) {
		String year = id.split("-")[0];
		String stringSeq = id.split("-")[1];
		int intSeq = Integer.parseInt(id.split("-")[1]);
		if (id.length() == 6 && year.length() == 2 && stringSeq.length() == 3) {
			String result = "";
			if (year.equals(mYear)) {
				intSeq += 1;
				stringSeq = String.format("%03d", intSeq); 
			} else {
				result = newWorshipId();
			}
			result = year + "-" + stringSeq;

			return result;
		}
		else {
			//형식오류
			return "00-000";
		}
	}
	
	
}
