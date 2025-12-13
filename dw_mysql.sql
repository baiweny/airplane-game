-- MySQL DDL转换文件
-- 由PostgreSQL DDL转换而来

-- ----------------------------
-- Table structure for ads_abnormal_city_category_sell_fluctuate_day_i
-- ----------------------------
DROP TABLE IF EXISTS ads_abnormal_city_category_sell_fluctuate_day_i;
CREATE TABLE ads_abnormal_city_category_sell_fluctuate_day_i (
  `trade_date` DATE NOT NULL,
  `store_sale_type` INT NOT NULL,
  `store_type_code` INT NOT NULL,
  `city_id` INT NOT NULL,
  `city_name` VARCHAR(50) COMMENT '城市名称',
  `region_code` VARCHAR(50) COMMENT '区域编码',
  `region_name` VARCHAR(50) COMMENT '区域名称',
  `first_category_no` VARCHAR(50) NOT NULL COMMENT '一级分类编码',
  `first_category_name` VARCHAR(50) COMMENT '一级分类名称',
  `sales_days` DECIMAL(27,2) COMMENT '前7天有销售天数',
  `avg_sale_amount` DECIMAL(27,2) COMMENT '前7天有销售天数平均销售额',
  `sale_amount_yesterday` DECIMAL(27,2) COMMENT '前一天销售金额',
  `fluctuate_rate_yesterday` DECIMAL(27,4) COMMENT '波动比例',
  `sale_amount_today` DECIMAL(27,2) COMMENT '当天销售金额',
  `fluctuate_rate_today` DECIMAL(27,4) COMMENT '下降比例',
  PRIMARY KEY (`trade_date`, `store_sale_type`, `store_type_code`, `city_id`, `first_category_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='城市品类销售额波动异常表';

-- ----------------------------
-- Table structure for ads_abnormal_city_sell_fluctuate_day_i
-- ----------------------------
DROP TABLE IF EXISTS ads_abnormal_city_sell_fluctuate_day_i;
CREATE TABLE ads_abnormal_city_sell_fluctuate_day_i (
  `trade_date` DATE NOT NULL,
  `store_sale_type` INT NOT NULL,
  `store_type_code` INT NOT NULL,
  `city_id` INT NOT NULL,
  `city_name` VARCHAR(50) COMMENT '城市名称',
  `region_code` VARCHAR(50) COMMENT '区域编码',
  `region_name` VARCHAR(50) COMMENT '区域名称',
  `sales_days` DECIMAL(27,2) COMMENT '前7天有销售天数',
  `avg_sale_amount` DECIMAL(27,2) COMMENT '前7天有销售天数平均销售额',
  `sale_amount_yesterday` DECIMAL(27,2) COMMENT '前一天销售金额',
  `fluctuate_rate_yesterday` DECIMAL(27,4) COMMENT '波动比例',
  `sale_amount_today` DECIMAL(27,2) COMMENT '当天销售金额',
  `fluctuate_rate_today` DECIMAL(27,4) COMMENT '下降比例',
  PRIMARY KEY (`trade_date`, `store_sale_type`, `store_type_code`, `city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='城市销售额波动异常表';

-- ----------------------------
-- Table structure for ads_abnormal_store_sell_fluctuate_day_i
-- ----------------------------
DROP TABLE IF EXISTS ads_abnormal_store_sell_fluctuate_day_i;
CREATE TABLE ads_abnormal_store_sell_fluctuate_day_i (
  `trade_date` DATE NOT NULL,
  `store_no` VARCHAR(50) NOT NULL COMMENT '店铺编码',
  `store_name` VARCHAR(50) COMMENT '店铺名称',
  `store_sale_type` INT COMMENT '店铺销售类型',
  `store_type_code` INT COMMENT '分店类型',
  `city_id` INT COMMENT '城市ID',
  `city_name` VARCHAR(50) COMMENT '城市名称',
  `region_code` VARCHAR(50) COMMENT '区域编码',
  `region_name` VARCHAR(50) COMMENT '区域名称',
  `is_day_clear` INT COMMENT '是否日清:0否,1是',
  `sales_days` DECIMAL(27,2) COMMENT '前7天有销售天数',
  `avg_sale_amount` DECIMAL(27,2) COMMENT '前7天有销售天数平均销售额',
  `sale_amount_yesterday` DECIMAL(27,2) COMMENT '前一天销售金额',
  `fluctuate_rate_yesterday` DECIMAL(27,4) COMMENT '波动比例',
  `sale_amount_today` DECIMAL(27,2) COMMENT '当天销售金额',
  `fluctuate_rate_today` DECIMAL(27,4) COMMENT '下降比例',
  PRIMARY KEY (`trade_date`, `store_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='门店销售额波动异常表（不考虑新店）';

-- ----------------------------
-- Table structure for ads_category_store_first_category_jxc_day_i
-- ----------------------------
DROP TABLE IF EXISTS ads_category_store_first_category_jxc_day_i;
CREATE TABLE ads_category_store_first_category_jxc_day_i (
  `trade_date` DATE NOT NULL,
  `week_trade_date` DATE COMMENT '周交易日期',
  `month_trade_date` DATE COMMENT '月交易日期',
  `store_no` VARCHAR(50) NOT NULL COMMENT '店铺编码',
  `store_name` VARCHAR(50) COMMENT '店铺名称',
  `store_sale_type` INT COMMENT '店铺销售类型',
  `store_type_code` INT COMMENT '分店类型',
  `worker_num` INT COMMENT '员工数量',
  `store_area` DECIMAL(27,2) COMMENT '店铺面积',
  `city_id` INT COMMENT '城市ID',
  `city_name` VARCHAR(50) COMMENT '城市名称',
  `region_code` VARCHAR(50) COMMENT '区域编码',
  `region_name` VARCHAR(50) COMMENT '区域名称',
  `is_day_clear` INT COMMENT '是否日清',
  `first_category_no` VARCHAR(50) NOT NULL COMMENT '一级分类编码',
  `first_category_name` VARCHAR(50) COMMENT '一级分类名称',
  `begin_qty` DECIMAL(27,3) COMMENT '期初数量',
  `begin_amount` DECIMAL(27,2) COMMENT '期初金额',
  `end_qty` DECIMAL(27,3) COMMENT '期末数量',
  `end_amount` DECIMAL(27,2) COMMENT '期末金额',
  `sale_qty` DECIMAL(27,3) COMMENT '销售数量',
  `sale_amount` DECIMAL(27,2) COMMENT '销售金额',
  `sale_cost` DECIMAL(27,2) COMMENT '销售成本',
  `sale_margin` DECIMAL(27,2) COMMENT '销售毛利',
  `receipt_qty` DECIMAL(27,3) COMMENT '收货数量',
  `receipt_amount` DECIMAL(27,2) COMMENT '收货金额',
  `loss_qty` DECIMAL(27,3) COMMENT '损耗数量',
  `loss_amount` DECIMAL(27,2) COMMENT '损耗金额',
  `system_adjust_qty` DECIMAL(27,3) COMMENT '系统调整数量',
  `system_adjust_amount` DECIMAL(27,2) COMMENT '系统调整金额',
  PRIMARY KEY (`trade_date`, `store_no`, `first_category_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='门店第一品类进销存天表';

-- ----------------------------
-- Table structure for ads_category_store_second_category_statistics_day_i
-- ----------------------------
DROP TABLE IF EXISTS ads_category_store_second_category_statistics_day_i;
CREATE TABLE ads_category_store_second_category_statistics_day_i (
  `trade_date` DATE NOT NULL COMMENT '交易日期',
  `week_trade_date` DATE COMMENT '周一日期',
  `month_trade_date` DATE COMMENT '月一日期',
  `store_no` VARCHAR(50) NOT NULL COMMENT '店铺编码',
  `store_name` VARCHAR(50) COMMENT '店铺名称',
  `store_sale_type` INT COMMENT '店铺销售类型',
  `store_type_code` INT COMMENT '分店类型',
  `worker_num` INT COMMENT '员工人数',
  `store_area` DECIMAL(27,2) COMMENT '门店面积',
  `city_id` INT COMMENT '城市ID',
  `city_name` VARCHAR(50) COMMENT '城市名称',
  `region_code` VARCHAR(50) COMMENT '区域编码',
  `region_name` VARCHAR(50) COMMENT '区域名称',
  `is_day_clear` INT COMMENT '是否日清:0否,1是',
  `first_category_no` VARCHAR(50) NOT NULL COMMENT '一级分类编码',
  `first_category_name` VARCHAR(50) COMMENT '一级分类名称',
  `second_category_no` VARCHAR(50) NOT NULL COMMENT '二级分类编码',
  `second_category_name` VARCHAR(50) COMMENT '二级分类名称',
  `order_num` INT COMMENT '销售单量',
  `sale_qty` DECIMAL(27,3) COMMENT '销售数量',
  `sale_amount` DECIMAL(27,2) COMMENT '销售金额',
  `dis_amount` DECIMAL(27,2) COMMENT '折扣金额',
  `sale_cost` DECIMAL(27,2) COMMENT '销售成本',
  `balance_amount` DECIMAL(27,2) COMMENT '余额支付金额',
  `cancel_sale_amount` DECIMAL(27,2) COMMENT '取消商品销售金额',
  `refund_sale_amount` DECIMAL(27,2) COMMENT '退款商品销售金额',
  `online_order_num` INT COMMENT '线上单量',
  `offline_order_num` INT COMMENT '线下单量',
  `online_sale_amount` DECIMAL(27,2) COMMENT '线上销售金额',
  `offline_sale_amount` DECIMAL(27,2) COMMENT '线下销售金额',
  `online_sale_cost` DECIMAL(27,2) COMMENT '线上销售成本',
  `offline_sale_cost` DECIMAL(27,2) COMMENT '线下销售成本',
  `loss_amount` DECIMAL(27,2) COMMENT '损耗金额',
  `receipt_amount` DECIMAL(27,2) COMMENT '收货金额（收货-退货-退配+调入-调出）',
  `require_amount` DECIMAL(27,2) COMMENT '要货金额',
  PRIMARY KEY (`trade_date`, `store_no`, `first_category_no`, `second_category_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='门店第二品类分析天表';

-- ----------------------------
-- 以下是PostgreSQL到MySQL的转换规则总结
-- ----------------------------
/*
PostgreSQL到MySQL的主要转换点：

1. 表名和模式：
   - PostgreSQL: "public"."table_name"
   - MySQL: table_name (不需要schema前缀)

2. 数据类型转换：
   - int4 -> INT
   - varchar(n) COLLATE "pg_catalog"."default" -> VARCHAR(n)
   - numeric(p,s) -> DECIMAL(p,s)
   - date -> DATE
   - 其他类型可能需要根据具体情况调整

3. 注释：
   - PostgreSQL使用单独的COMMENT ON语句
   - MySQL直接在列定义后使用COMMENT '注释内容'

4. 主键：
   - 为每个表添加了PRIMARY KEY约束，基于NOT NULL列组合

5. 存储引擎和字符集：
   - 添加了ENGINE=InnoDB DEFAULT CHARSET=utf8mb4

6. 索引和外键：
   - 如果原表有索引或外键，需要单独转换

由于原文件过大，无法一次性转换所有表，您可以按照上述规则继续转换其他表结构。
*/