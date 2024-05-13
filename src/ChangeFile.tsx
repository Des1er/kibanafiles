import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.css';

interface ConfigField {
    key: string;
    value: any;
    type: "string" | "number" | "boolean";
}

function ChangeFile() {
    const navigate = useNavigate();
    const location = useLocation();
    const [fields, setFields] = useState<ConfigField[]>([]);
    const [res, setRes] = useState('');
    const [error, setError] = useState('');
    const fileName =  location.state.fileName;

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const url = 'http://localhost:4000/configs/' + fileName;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                });

                if (response.status === 401) {
                    navigate('/login');
                } else {
                    const configData = await response.json();
                    
                    console.log('Received config data:', configData);

                    const updatedFields: ConfigField[] = Object.entries(configData).map(([key, value]) => ({
                        key,
                        value,
                        type: typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string',
                    }));

                    setFields(updatedFields);
                }
            } catch (error) {
                console.error('Error fetching configuration:', error);
            }
        };

        fetchConfig();
    }, [location.state.fileName, navigate]);

    const handleFieldChange = (index: number, newValue: any) => {
        setFields((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index].value = newValue;
            return updatedFields;
        });
    };

    const handleDeleteField = (index: number) => {
        setFields((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields.splice(index, 1);
            return updatedFields;
        });
    };

    const handleAddField = (newKey: string, newValue: string) => {
        if (newKey.trim() === '') {
            alert('Please enter a valid key for the new field.');
            return;
        }

        let parsedValue: any;
        let valueType: 'string' | 'number' | 'boolean' = 'string';

        if (!isNaN(Number(newValue))) {
            parsedValue = Number(newValue);
            valueType = 'number';
        } else if (newValue.toLowerCase() === 'true' || newValue.toLowerCase() === 'false') {
            parsedValue = newValue.toLowerCase() === 'true';
            valueType = 'boolean';
        } else {
            parsedValue = newValue;
        }

        setFields((prevFields) => [
            ...prevFields,
            { key: newKey, value: parsedValue, type: valueType }
        ]);
    };

    const handleSubmit = () => {
        const updatedConfig: Record<string, any> = {};

        fields.forEach((field) => {
            const keys = field.key.split('.');
            let currentLevel = updatedConfig;

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (i === keys.length - 1) {
                    currentLevel[key] = field.value;
                } else {
                    if (!currentLevel[key]) {
                        currentLevel[key] = {};
                    }
                    currentLevel = currentLevel[key];
                }
            }
        });

        console.log('Submitting updated configuration:', updatedConfig);

        const url = 'http://localhost:4000/configs/' + fileName;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(updatedConfig)
        })
        .then((response) => {
            if (response.status === 401) {
                navigate('/login');
            } else {
                console.log(response);
            }
            return response.json();
        })
        .then((data) => {
            if (data.error){
                setError(data.error)
            }else{
                setRes(data.response)
            }
            console.log(data);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div>
            {res||error? 
            <div className= {error? "my-3 bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3":"bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3"} role="alert">
            <p className="font-bold">{error?'Error!':'Congratulations!'}</p>
            <p className="text-sm">{res?res:error}</p>
            </div>: null}
            {fields.map((field, index) => (
                <div key={index} className="my-3 flex items-center gap-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">{field.key}</label>
                    <input
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type={field.type}
                        value={field.value}
                        onChange={(e) => handleFieldChange(index, e.target.value)}
                    />
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-2 right-0" onClick={() => handleDeleteField(index)}>Delete</button>
                </div>
            ))}
            <div>
                <input
                    type="text"
                    placeholder="New Field Key"
                    id="newFieldKey"
                    className="block my-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <input
                    type="text"
                    placeholder="New Field Value"
                    id="newFieldValue"
                    className="block my-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-3"
                    onClick={() => {
                        const newKeyInput = document.getElementById('newFieldKey') as HTMLInputElement;
                        const newValueInput = document.getElementById('newFieldValue') as HTMLInputElement;
                        handleAddField(newKeyInput.value, newValueInput.value);
                        newKeyInput.value = '';
                        newValueInput.value = '';
                    }}
                >
                    Add Field
                </button>
            </div>
            <button className="flex my-4 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default ChangeFile;
