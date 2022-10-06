


from decimal import setcontext
import json
from unicodedata import category
from flask import Flask,jsonify,request,abort,make_response
from backend import Companies, Percent, Sectors
from datetime import date,timedelta,datetime
import datetime
import pandas as pd
import pandas_datareader.data as web
from sqlalchemy.orm import relationship

from ftsestock import get_stock_daily

def basic_stocklist():

    try:
        
        stocks = Companies.query.all()


        output_stocks = []

        for stk in stocks:
            stk_data ={}
            stk_data['code'] = stk.code
            stk_data['name'] = stk.name
            stk_data['marketcap'] = stk.marketcap
            stk_data['ISIN'] = stk.ISIN
            stk_data['admitdate'] = stk.admitdate
            stk_data['subsectors'] = stk.subsectors
          
        
            stock = Percent.query.filter_by(code=stk.code).first()
            stk_data['percentvalue'] = stock.name

            output_stocks.append(stk_data)

        return jsonify({'response' :output_stocks}) 

    except Exception as e:
       abort(e) 

def stock_percent(ticker):

    try:
        
        stocks = Percent.query.filter_by(code=ticker).first()

        output_stocks = []

        for stk in stocks:
            stk_data ={}
            stk_data['code'] = stk.code
            stk_data['name'] = stk.name
            stk_data['marketcap'] = stk.marketcap
            stk_data['ISIN'] = stk.ISIN
            stk_data['admitdate'] = stk.admitdate
            stk_data['subsectors'] = stk.subsectors
          
            
            output_stocks.append(stk_data)

        return jsonify({'response' :output_stocks}) 

    except Exception as e:
       abort(e) 


def stockInfoDB(code):

    try:
        
        stock = Companies.query.filter_by(code=code).first()

        sect_details = Sectors.query.filter_by(Subsector=stock.subsectors).first()

        valpercent = Percent.query.filter_by(code=code).first()
        
        output_stocks = []

        stk_data ={}
        stk_data['code'] = stock.code
        stk_data['name'] = stock.name
        stk_data['marketcap'] = stock.marketcap
        stk_data['ISIN'] = stock.ISIN
        stk_data['admitdate'] = stock.admitdate
        stk_data['subsectors'] = stock.subsectors
        stk_data['news'] = getstocknews(stock.newscode)
        stk_data['percentvalue'] = valpercent.name

        stk_data['industry'] = sect_details.Industry
        stk_data['supersector'] = sect_details.Supersector
        stk_data['sector'] = sect_details.Sector
        stk_data['definition'] = sect_details.Definition
       
        output_stocks.append(stk_data)



        return jsonify(output_stocks) 

    except Exception as e:
       abort(e) 



def homeVolMarket():

    try:
        
        stocks = Companies.query.order_by(Companies.marketcap.desc()).limit(5).all()

        output_stocks = []

        for stk in stocks:
            stk_data ={}
            stk_data['code'] = stk.code
            stk_data['name'] = stk.name
            stk_data['marketcap'] = stk.marketcap
            stk_data['ISIN'] = stk.ISIN
            stk_data['admitdate'] = stk.admitdate
            stk_data['subsectors'] = stk.subsectors
          
            
            output_stocks.append(stk_data)

        return jsonify({'response' :output_stocks}) 

    except Exception as e:
       abort(e) 


def percentChnge():

    try:
        
        stocks = Companies.query.order_by(Companies.marketcap.desc()).all()
        stockdesc = Companies.query.order_by(Companies.marketcap.desc()).limit(5).all()
        

        percentage_change_dict = {}

        for stk in stocks:
            df = web.DataReader(stk.code+'.L', 'yahoo', start = date.today() + timedelta(days = -7))

            prev_close = df['Close'][-2]
            close = df['Close'][-1]
            perc_change = (close - prev_close)/prev_close
            perc_change = perc_change * 100
            percentage_change_dict[stk.code] = perc_change

        return jsonify(percentage_change_dict) 

    except Exception as e:
       abort(e) 


def diffIndustry():

#     output_category= []
    try:
        outercompanydict =[]
#         newqry = Sectors.query(Sectors.Industry.distinct())
        productstore = Companies.query.join(Sectors, Companies.subsectors==Sectors.Subsector).all()
#                                 #  .order_by(ProductStore.price).first()
#         billing_address = relationship("Companies", foreign_keys="Sectors.Subsector")
#         for pdt in billing_address:
        for pdt in productstore:
            stk_op ={}
            stk_op['code']= pdt.code
            stk_op['superSector']= pdt.Industry

            outercompanydict.append(stk_op)
        return jsonify(outercompanydict) 

    except Exception as e:
       abort(e) 



def gainerLosers():

    output_gainers= []
    output_losers =[]
    try:
        
        Gainers = Percent.query.order_by(Percent.name.desc()).limit(5).all()
        Losers = Percent.query.filter(Percent.name < 0).order_by(Percent.name.desc()).limit(5).all()

        op_stock ={}
        for item in Gainers:
             stk_data ={}
             stk_data['percent_code'] = item.code
             stk_data['percent_val'] = item.name

            #  stock = Companies.query.filter_by(code=item.code).first()

            #  stk_data['name']=stock.name
            #  stk_data['data'] = json.loads(get_stock_daily(item.code))['Close']

             output_gainers.append(stk_data)


        for item in Losers:
             stk_data ={}
             stk_data['percent_code'] = item.code
             stk_data['percent_val'] = item.name
            #  stock = Companies.query.filter_by(code=item.code).first()
            #  stk_data['name']=stock.name
            #  stk_data['data'] = json.loads(get_stock_daily(item.code))['Close']
             output_losers.append(stk_data)



        op_stock['Gainers']=output_gainers
        op_stock['Losers'] =output_losers

        return jsonify(op_stock)

    except Exception as e:
       abort(e) 


# the stock news API is referenced from https://stocknewsapi.com
def getstocknews(ticker):
    
    news_api = 'https://stocknewsapi.com/api/v1?tickers='+ticker.lower()+'&items=50&page=1&token=onb2sezfnep0ygrpmza6qrbhjhrl0bydr15fylec'
 
    return news_api