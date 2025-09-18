// This file contains utility functions for managing environment variables.

import { config } from 'dotenv';

config();

export const getEnv = (key: string, defaultValue?: string): string => {
    return process.env[key] || defaultValue || '';
};

export const getRequiredEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};