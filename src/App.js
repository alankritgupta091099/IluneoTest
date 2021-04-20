import React , { useState , useEffect} from "react";
import { Table , Typography } from 'antd';
import keyword_extractor from "keyword-extractor";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import PeopleBookData from "./PeopleBook";
import EyegleSpiesData from "./EyegleSpies";
import 'antd/dist/antd.css';

function CustomTooltip({ payload, label, active }) {    
  if (active) {
    return (
      <div>
        <p className="label">{` Word Length : ${label}`}</p>
        <p className="label">{` Number of Words : ${payload[0].value}`}</p>
        <p className="label">{` List of Words :`}</p>
        {payload[0].payload.keywordsList.map((item)=>(<p>{item}</p>))}
      </div>
    );
  }  
  return null;
}

function App() {  

  const [keywords, setkeywords] = useState([])
  const [chartData, setchartData] = useState([])
  const { Title } = Typography;

  const columnsUserTable = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      defaultSortOrder: ['descend', 'ascend'],
      sorter: (a, b) => a.gender.localeCompare(b.gender),
    }
  ];

  var userArr = [];  
  PeopleBookData.forEach(user => {  
    userArr.push({
      text:user.name,
      value:user.id
    })
  });

  const columnsKeywordsTable = [
    {
      title: 'Keyword',
      dataIndex: 'keyword',
      filters: userArr,
      onFilter: (value, record) => record.uid.includes(value),
      sorter: (a, b) => a.keyword.localeCompare(b.keyword),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      defaultSortOrder: ['descend', 'ascend'],
      sorter: (a, b) => a.frequency - b.frequency,
    }
  ];

  useEffect(() => {
    var arr = []
    var arrChart = []
    EyegleSpiesData.forEach(element => {
      var extractedKeywords = keyword_extractor.extract(element.query,{
          language:"english",
          return_changed_case:true,
          remove_duplicates: false
      })
      extractedKeywords.forEach(keyword => {

        //Making dataset for chart purpose
        var foundLength = arrChart.find(item => {
          if(item.length===keyword.length){
            item.keywordsList.push(keyword);
            item.numberOfKeywords = item.keywordsList.length;
            return true
          }
          return false
        });
        if(!foundLength) {
          arrChart.push({
            length:keyword.length,
            keywordsList:[keyword],
            numberOfKeywords: 1
          })
        }

        //Making dataset for keywords table
        var oldKeyword = arr.find((item)=>{
          if(item.keyword===keyword){
            item.frequency+=1
            return true
          }
          return false
        })
        if(!oldKeyword)
          arr.push({
            keyword,
            uid:element.uid,
            frequency:1
          })
      });      
    }) 
    setkeywords(arr)
    setchartData(arrChart)
    // console.log(arrChart)
  }, [])

  return (
    <div className="App">
      <Title level={4} type="secondary" style={{marginBottom:40}}>Task 1 : Lighthouse Inc. wants users to be represented as a gridview with sorting based on name and/or gender.</Title>
      <Table columns={columnsUserTable} dataSource={PeopleBookData}/>

      <Title level={4} type="secondary"  style={{marginBottom:40}}>Task 2 : The company wants keywords to be filtered by User </Title>
      <Title level={4} type="secondary"  style={{marginBottom:40}}>Task 3 : The company wants keywords to be presented as listview and sorted by frequency & Alphabetic</Title>
      <Table columns={columnsKeywordsTable} dataSource={keywords}/>

      <Title level={4} type="secondary"  style={{marginBottom:40}}>Task 4 : The company would also like to show the distribution of keywords of different lengths  in either a pie-chart or bar chart. Such that ‘cat’ contributes towards words of length 3 and ‘elephant’ contributes to the words of length 8</Title>
      <BarChart
        width={900}
        height={450}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 15,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="length" />
        <YAxis />
        <Tooltip wrapperStyle={{ width: 300, backgroundColor: '#ffffff' , padding:15, borderRadius:10}}  content={<CustomTooltip />}/>
        <Legend width={200} wrapperStyle={{ top: 40, right: 50, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
        <Bar dataKey="numberOfKeywords" fill="#8884d8" />
      </BarChart>
    </div>
  );
}

export default App;
