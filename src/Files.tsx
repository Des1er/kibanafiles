import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Files() {
    const [yamlFiles, setYamlFiles] = useState<string[]>([]);

    useEffect(() => {
        if (!localStorage.getItem('files')) {
            localStorage.setItem('files', 'kibana-1.yml, kibana-2.yml, kibana-3.yml');
        }

        const storedString = localStorage.getItem('files') || '';
        const array = storedString.split(',');
        setYamlFiles(array);
    }, []);

    const navigate = useNavigate();

    const handleEditClick = (file: string) => {
        navigate('/configure', {
            state: {
                fileName: file
            }
        });
    };

    const handleAddClick = () => {
        navigate('/createfile');
    };

    return (
        <div className='w-1/2 h-1/2 relative'>
            <div className="w-full relative overflow-x-auto sm:rounded-lg my-20">
                <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 w-full">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                File name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {yamlFiles.map((file) => (
                            <tr key={file} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {file}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleEditClick(file)}
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button
                onClick={handleAddClick}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute bottom-0 right-0"
            >
                Create File
            </button>
        </div>
    );
}

export default Files;
