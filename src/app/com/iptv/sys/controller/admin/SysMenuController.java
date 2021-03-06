package com.iptv.sys.controller.admin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.iptv.core.common.BizException;
import com.iptv.core.utils.BaseUtil;
import com.iptv.sys.service.SysMenuService;

@Controller
@RequestMapping("/sys/menu")
@SuppressWarnings("rawtypes")
public class SysMenuController extends AdminBaseController {
	@Resource
	SysMenuService sysMenuService;

	@RequestMapping("/index")
	public ModelAndView index() {
		return view();
	}

	@RequestMapping(value = "/menuList", method = RequestMethod.GET)
	public @ResponseBody List menuList() {
		List data = sysMenuService.getAllMenus();
		return data;
	}

	@RequestMapping(value = "/menuNodes", method = RequestMethod.GET)
	public @ResponseBody List menuNodes() {
		List data = sysMenuService.getALlMenusForNode();
		return data;
	}

	@RequestMapping(value = "/save", method = RequestMethod.POST)
	@SuppressWarnings("unchecked")
	public @ResponseBody Map save(@RequestBody Map map) {
		List<String> messages = new ArrayList<String>();
		Map res = new HashMap();

		try {
			sysMenuService.save(map);
		} catch (BizException biz) {
			messages.addAll(biz.getMessages());
		} catch (Exception ex) {
			log.error("数据库错误：" + ex.getMessage());
			messages.add("未知错误。");
		}

		if (messages.size() > 0) {
			res.put("result", false);
			res.put("message", BaseUtil.toHtml(messages));
		} else {
			res.put("result", true);
			res.put("message", "保存成功。");
		}

		log.info("添加或者修改系统菜单");
		return res;
	}

	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	@SuppressWarnings("unchecked")
	public @ResponseBody Map delete(@RequestBody Map map) {
		List<String> messages = new ArrayList<String>();
		Map res = new HashMap();

		try {
			sysMenuService.delete(map);
		} catch (BizException biz) {
			messages.addAll(biz.getMessages());
		} catch (Exception ex) {
			log.error("数据库错误：" + ex.getMessage());
			messages.add("未知错误。");
		}

		if (messages.size() > 0) {
			res.put("result", false);
			res.put("message", BaseUtil.toHtml(messages));
		} else {
			res.put("result", true);
			res.put("message", "删除成功。");
		}

		log.info("删除系统菜单");
		return res;
	}

	@RequestMapping("/userMenuList")
	public @ResponseBody List userMenuList(HttpServletRequest req) {
		HttpSession session = req.getSession();
		Integer userId = Integer.valueOf(session.getAttribute("userId").toString());

		List data = sysMenuService.getUserMenus(userId);
		return data;
	}
}
