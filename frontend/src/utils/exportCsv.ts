// This file contains utility functions for exporting tasks to CSV format.

import { Parser } from 'json2csv';

export const exportTasksToCsv = (tasks: Array<{ task: string; time?: string; category?: string; deadline?: string }>, filename: string) => {
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(tasks);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};