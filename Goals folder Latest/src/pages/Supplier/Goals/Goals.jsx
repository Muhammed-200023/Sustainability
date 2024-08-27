import React, { useEffect, useState } from 'react';
import { Layout, Tabs, Modal, Input, Select, Button } from 'antd';
import Sidebar from '../../../components/layout/sidebar/Sidebar';
import { fetchData } from '../../../services/apiService';
import Nav from '../../../components/layout/navbar/Nav';
import Resetbtn from '../../../components/common/Button/Resetbtn';
import Savebtn from '../../../components/common/Button/Savebtn';
import Deletebtn from '../../../components/common/Button/Deletebtn';
import Addbtn from '../../../components/common/Button/Addbtn';
import './Mainpillar.css';

const { Content } = Layout;
const { confirm } = Modal;
const { Option } = Select;

const parseQuestionText = (text, inputFields) => {
    const parts = text.split(/(<[^>]+>)/g);

    return parts.map((part, index) => {
        const match = part.match(/<([^>]+)>/);
        if (match) {
            const field = inputFields.find(f => f.label === match[1]);
            if (field) {
                if (field.inputType === 'number') {
                    return (
                        <Input
                            key={index}
                            defaultValue={field.defaultValue}
                            className="w-[70px] text-center mx-1"
                        />
                    );
                } else if (field.inputType === 'dropdown') {
                    return (
                        <Select
                            key={index}
                            defaultValue={field.defaultValue}
                            className="mx-1"
                        >
                            {field.options.map(option => (
                                <Option key={option} value={option}>
                                    {option}
                                </Option>
                            ))}
                        </Select>
                    );
                }
            }
        }
        return <span key={index}>{part}</span>;
    });
};

const generateTabContent = (pillar) => {
    return pillar.questions.map((question, index) => (
        <div key={index} className="ml-10 mb-4 mt-4 flex">
            <div className="flex-1 flex items-center">
                {parseQuestionText(question.text, question.inputFields)}
            </div>
            <div className="flex flex-col  gap-2">
                <Addbtn />
                <Deletebtn />
            </div>
        </div>
    ));
};

const Goals = () => {
    const [activeTabKey, setActiveTabKey] = useState(null);
    const [pillarData, setPillarData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const result = await fetchData();
                setPillarData(result);
                const energyTab = result.find(pillar => pillar.goalType === 'Energy');
                setActiveTabKey(energyTab ? energyTab.id : result[0].id);
            } catch (error) {
                console.error('Error fetching page content:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPageData();
    }, []);

    const handleNextClick = () => {
        confirm({
            title: 'Are you sure you want to move to the next page?',
            onOk() {
                const currentIndex = pillarData.findIndex(item => item.id === activeTabKey);
                const nextIndex = (currentIndex + 1) % pillarData.length;
                setActiveTabKey(pillarData[nextIndex].id);
            },
        });
    };

    const items = pillarData.map(pillar => ({
        key: pillar.id,
        label: pillar.goalType,
        children: generateTabContent(pillar),
    }));
    

    return (
        <Layout>
            <Nav />
            <Layout>
                <Sidebar />
                <Content style={{ backgroundColor: '#EAF5FF', padding: '24px' }}>
                    <Content className="ml-[43px] bg-white mb-[17px] rounded-b-[20px] w-[975px] h-auto shadow-md">
                        <Tabs
                            activeKey={activeTabKey}
                            items={items}
                            onChange={(key) => setActiveTabKey(key)}
                            tabBarStyle={{
                                backgroundColor: '#014D4E',
                                height: '45px',
                                marginBottom: 0,
                            }}
                            className="custom-tabs"
                            tabBarGutter={0}
                        />
                    </Content>
                    <div className="w-[975px] flex justify-end gap-2.5">
                        <Resetbtn />
                        <Savebtn />
                        <Button
                            className="h-[30px] w-[87px] border-[#014D4E] text-[#014D4E] border-[1.5px] rounded-[10px] border-solid"
                            onClick={handleNextClick}
                        >
                            Next
                        </Button>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Goals;
