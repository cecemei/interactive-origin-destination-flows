import psycopg2
import pdb
import json

def main(dp='dp1'):
    conn_string = '''host=caworkhorse2 dbname=national_db_2016 user=postgres password=postgres'''
    conn = psycopg2.connect(conn_string)
    cursor = conn.cursor()
    
    query = '''       
        SELECT row_to_json(f)
          FROM
          (SELECT 'FeatureCollection' as type, array_to_json(array_agg(feat)) as features
          FROM (select 'Feature' as type, ST_AsGeoJSON(geom)::json as geometry, 
              row_to_json((select l from (select od_flows.o as name, array[taz.st_x, taz.st_y] as centroid, 
              od_flows.flows) as l)) as properties
            from 
              (select od.o, 
              array_to_string(array_agg(concat(od.d-1, ':', od.%s)), ',') as flows
               from model.florida_od_dt1 as od where od.%s>0 and od.d<=10442 group by od.o) od_flows
           right join (select * from sl.realflorida_taz )  as taz
           on od_flows.o = taz.tazid
           order by taz.tazid) feat) f;
         '''%(dp, dp)
    cursor.execute(query)
    records = cursor.fetchall()
    print(type(records))
    #pdb.set_trace()
    with open('florida.json', 'w') as f:
        json.dump(records[0][0], f)
    
if __name__ == "__main__":
    main(dp='dp2')