ftse100 = [ 'III.L','ABDN.L', 'ADM.L','AAF.L','AAL.L','ANTO.L', 'AHT.L','ABF.L','AZN.L','AUTO.L',
'AVST.L', 'AVV.L','AV.L', 'BME.L','BA.L', 'BARC.L', 'BDEV.L', 'BKG.L','BP.L', 'BATS.L',
'BLND.L', 'BT-A.L', 'BNZL.L', 'BRBY.L', 'CCH.L','CPG.L','CRH.L','CRDA.L', 'DCC.L','DPH.L', 
'DGE.L','EDV.L','ENT.L','EXPN.L', 'FERG.L', 'FLTR.L', 'FRES.L', 'GSK.L','GLEN.L', 'HLMA.L',
'HL.L', 'HIK.L','HWDN.L', 'HSBA.L', 'IHG.L','IMB.L','INF.L','ICP.L','IAG.L','ITRK.L',
'ITV.L','JD.L', 'KGF.L','LAND.L', 'LGEN.L', 'LLOY.L', 'LSEG.L', 'MNG.L','MGGT.L', 'MRO.L', 
'MNDI.L', 'NG.L', 'NWG.L','NXT.L','OCDO.L', 'PSON.L', 'PSH.L','PSN.L','PHNX.L', 'PRU.L', 
'RKT.L','REL.L','RTO.L','RMV.L','RIO.L','RR.L', 'RMG.L','RS.L', 'SGE.L','SBRY.L',
'SDR.L','SMT.L','SGRO.L', 'SVT.L','SHEL.L', 'SMDS.L', 'SMIN.L', 'SN.L', 'SKG.L','SPX.L', 
'SSE.L','STAN.L', 'STJ.L','TW.L', 'TSCO.L', 'ULVR.L', 'UU.L', 'VOD.L','WTB.L','WPP.L' ]


from datetime import date,timedelta,datetime
import datetime
import pandas as pd
import pandas_datareader.data as web

from flask import Blueprint, render_template, session,abort,jsonify,request,abort,make_response

# from backend import Companies


ftseStock = Blueprint('ftsestock',__name__)

@ftseStock.route("/dailystock" , methods=['GET'])
def get_a_stock():

   

    try:
        
        df = web.DataReader('BRBY'+'.L', 'yahoo', start='2017-08-20')
        
        return df.to_json()

    except Exception as e:
       abort(e)  

@ftseStock.route("/stockdaily/<ticker>" , methods=['GET'])
def get_stock_daily(ticker):

   
    try:
        
        df = web.DataReader(ticker+'.L',
             'yahoo', start=date.today() + timedelta(days=-7), end=date.today())
        df = df.reset_index(drop=False)
        df.Date = df.Date.astype(str)
        
        return df.tail(1).to_json()


    except Exception as e:
       abort(e)


@ftseStock.route("/stockdailylist" , methods=['PUT'])
def get_stock_dailylist():

    data = request.get_json()
    print(data)
    try:
       
        df = web.DataReader(data,
            'yahoo', start=date.today() + timedelta(days=-7), end=date.today())
        # df = df.reset_index(drop=False)
        # df.Date = df.Date.astype(str)
        df2 = df.drop(columns=['Volume', 'Low','High','Adj Close'])
        newlist = [{ 'close' :df2['Close'].tail(1).values.tolist(),'open': df2['Open'].tail(1).values.tolist()}]
        return newlist


    except Exception as e:
       abort(e)




@ftseStock.route("/plotgraph/<ticker>" , methods=['GET'])
def plot_graph(ticker):

   
    try:
        df = web.DataReader(ticker+'.L', 'yahoo', end = date.today() , start='2017-08-30')
        df = df.reset_index(drop=False)
        df.Date = df.Date.astype(str)
        
        return df.to_json()


    except Exception as e:
       abort(e) 


# args = request.args
# print (args) # For debugging
# no1 = args['key1']
# no2 = args['key2']
# return jsonify(dict(data=[no1, no2]))

