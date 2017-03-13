package com.iptv.app.controller.admin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.iptv.app.service.RegionService;
import com.iptv.app.service.SellerService;
import com.iptv.core.common.BizException;
import com.iptv.core.common.KendoResult;
import com.iptv.core.utils.BaseUtil;
import com.iptv.core.utils.JsonUtil;

@Controller
@RequestMapping("/admin/seller")
@SuppressWarnings({ "rawtypes", "unchecked"})
public class AdminSellerController extends AdminBaseController{
	@Resource
	private SellerService sellerService;
	@Resource
	private RegionService regionService;

	@RequestMapping("/index")
	public ModelAndView index() throws JsonProcessingException{
		Map res = new HashMap();

		List province = regionService.getRegions();
		res.put("province", JsonUtil.getJson(province));

		return view("/admin/seller/index",res);
	}
	
	@RequestMapping(value="/sellerList",method = RequestMethod.GET)
	public @ResponseBody KendoResult sellerList(HttpServletRequest request,HttpServletResponse response){
		Map param = BaseUtil.getParameterMap(request);
		KendoResult data = sellerService.getSellersPaged(param);

		return data;
	}
	
	@RequestMapping(value="/getSeller",method = RequestMethod.GET)
	public @ResponseBody Map getSeller(HttpServletRequest request,HttpServletResponse response){
		Map param = BaseUtil.getParameterMap(request);
		Map data = sellerService.getSeller(Integer.valueOf(param.get("Id").toString()));

		return data;
	}

	@RequestMapping(value="/save",method = RequestMethod.POST)
	public @ResponseBody Map save(@RequestBody Map map){
		List<String> messages = new ArrayList<String>();
		Map res = new HashMap();

		try {
			sellerService.save(map);
		} catch (BizException biz) {
			messages.addAll(biz.getMessages());
		} catch (Exception ex) {
			log.error("数据库错误：" + ex.getMessage());
			messages.add("未知错误。");
		}

		if (messages.size() > 0) {
			res.put("result", false);
			res.put("message", BaseUtil.toHtml(messages));
		}else{
			res.put("result", true);
			res.put("message", "保存成功。");
		}

		log.info("添加或者修改商家");
		return res;
	}

	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public @ResponseBody Map delete(@RequestBody Map map) {
		List<String> messages = new ArrayList<String>();
		Map res = new HashMap();

		try {
			sellerService.delete(map);
		} catch (BizException biz) {
			messages.addAll(biz.getMessages());
		} catch (Exception ex) {
			log.error("错误信息：" + ex.getMessage());
			messages.add("未知错误。");
		}

		if (messages.size() > 0) {
			res.put("result", false);
			res.put("message", BaseUtil.toHtml(messages));
		}else{
			res.put("result", true);
			res.put("message", "删除成功。");
		}

		log.info("删除商家");
		return res;
	}
}
