'use client'

import { UseMutateFunction } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const useZodForm = (
    schema: any,
    mutation: UseMutateFunction<any, any, any, any>,
    defaultValues?: any
) => {
    const {
        register,
        watch,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {...defaultValues}
    });

    const onFormSubmit = handleSubmit(async(values) => {
        mutation({ ...values });
    });

    return {
        register,
        watch,
        reset,
        onFormSubmit,
        errors
    }
}

export default useZodForm;

//! suraj did so many changes to this file check this time line for old code 04:36:00