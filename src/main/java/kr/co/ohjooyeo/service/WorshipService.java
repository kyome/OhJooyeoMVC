package kr.co.ohjooyeo.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.ohjooyeo.dao.WorshipDAO;
import kr.co.ohjooyeo.vo.WorshipAdVO;
import kr.co.ohjooyeo.vo.WorshipOrderVO;
import kr.co.ohjooyeo.vo.WorshipVO;

@Service
public class WorshipService {
	private static final Logger logger = LoggerFactory.getLogger(WorshipService.class);
	
	@Autowired
	WorshipDAO worshipDAO;
	
	public List<Map<String, String>> getWorshipList() {
		return worshipDAO.getWorshipList();
	}

	public boolean addWorship(WorshipVO worshipVO) {
		if (worshipDAO.insertWorship(worshipVO) == 1) {
			return true;
		}else {
			return false;
		}
	}

	public List<String> getWorshipIdList(String churchId) {
		return worshipDAO.getWorshipIdList(churchId);
	}
	
	public String getLastWorshipId(String churchId) {
		return worshipDAO.getLastWorshipId(churchId);
	}
	
	
	public boolean update(Map<String,String> worshipMap) {
		if(worshipMap.size()>2) {
			
//			updateWorship -> {worshipId=36-12, userId=admin}
//			logger.debug(worshipMap.toString());
			
			worshipDAO.updateWorship(worshipMap);	
			return true;
		} else {
			return false;
		}
		
	}
	
	public void delete(String worshipId) {
		worshipDAO.delete(worshipId);
	}

	public Map<String, String> getWorshipInfo(String worshipId) {
		logger.debug("요청 : " + worshipId);
		return worshipDAO.getWorshipInfo(worshipId);
	}
	

	public Map <String,List<Object>> analyzeValues(Map<String, List<String>> params, String voName) {
		Map <String,List<Object>> result = new HashMap<>();
		List<Object> addList = new ArrayList<>();
		List<Object> updateList = new ArrayList<>();
		result.put("addList" ,addList);
		result.put("updateList", updateList);
		
		/* worship_id에 속하는 orderId의 최대값 구하기 */
		int maxId = 0;
		
		if(voName.equals("order")) {
			for(String id : params.get("orderId")) {
				if(maxId <= Integer.valueOf(id)) {
					maxId = Integer.valueOf(id);				
				}
			}
			for(int i = 0 ; i < params.get("orderId").size() ; i++) {
				System.out.println(params);
				WorshipOrderVO order = new WorshipOrderVO(
						params.get("worshipId").get(0), 
						Integer.valueOf(params.get("orderId").get(i)), 
						i, 
						params.get("orderType").get(i), 
						params.get("orderTitle").get(i), 
						params.get("detail").get(i), 
						params.get("orderPresenter").get(i));
				if (params.get("orderId").get(i).equals("-1")  ) {
					order.setOrderId(++maxId);
					addList.add(order);
				}else if(params.get("orderUpdateYN").get(i).equals("1") ||!params.get("orderOrder").get(i).equals(Integer.toString(i)) ){
					updateList.add(order);
				}
			}

		}if(voName.equals("ad")) {
			for(String id : params.get("adId")) {
				if(maxId <= Integer.valueOf(id)) {
					maxId = Integer.valueOf(id);				
				}
			}
			//String worshipId, int advertisementId, int order, String title, String content
			for(int i = 0 ; i < params.get("adId").size() ; i++) {
				WorshipAdVO ad = new WorshipAdVO(
						params.get("worshipId").get(0), 
						Integer.valueOf(params.get("adId").get(i)), 
						i, 
						params.get("adTitle").get(i), 
						params.get("adContent").get(i));
				if (params.get("adId").get(i).equals("-1")  ) {
					ad.setAdId(++maxId);
					addList.add(ad);
				}else if(params.get("adUpdateYN").get(i).equals("1") ||!params.get("adOrder").get(i).equals(Integer.toString(i)) ){
					updateList.add(ad);
				}
			}
		}
		
		return result;
	}


	
}
