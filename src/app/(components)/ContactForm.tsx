'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addDoc, collection } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { app } from '../config/firebase';
import toast from 'react-hot-toast';

const db = getFirestore(app);

interface FormData {
  name: string;
  email: string;
  inquiryType: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        name: data.name,
        email: data.email,
        inquiryType: data.inquiryType,
        subject: data.subject,
        message: data.message,
        timestamp: new Date(),
      });
      toast.success('Inquiry submitted successfully.');
      reset();
    } catch (error) {
      console.error('Error adding document: ', error);
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto rounded-2xl bg-secondary/50 p-10 shadow-lg">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Get In Touch</h2>
        <p className="text-center text-white/70 mb-8">
          Have a question or want to work together? Send us a message and we&#39;ll get back to you.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-[#685885] bg-opacity-30 p-6 rounded-xl">
          <div>
            <input
              type="text"
              placeholder="Name"
              {...register('name', { required: 'Name is required' })}
              className="w-full rounded-lg bg-[#b5a6d0] text-purple-950 placeholder-fuchsia-50 focus:border-[#200053] focus:ring-2 focus:ring-[#200053]-light px-4 py-3"
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address',
                },
              })}
              className="w-full rounded-lg bg-[#b5a6d0] text-purple-950 placeholder-fuchsia-50 focus:border-[#200053] focus:ring-2 px-4 py-3"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <select
              {...register('inquiryType', { required: 'Please select an inquiry type' })}
              className="w-full rounded-lg bg-[#b5a6d0] text-fuchsia-50 focus:border-[#200053] focus:ring-2 focus:ring-[#200053]-light px-4 py-3"
            >
              <option value="">Type of Inquiry</option>
              <option value="General">General</option>
              <option value="Collaboration">Collaboration</option>
              <option value="Support">Support</option>
              <option value="Other">Other</option>
            </select>
            {errors.inquiryType && <p className="text-red-400 text-sm mt-1">{errors.inquiryType.message}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Subject"
              {...register('subject', { required: 'Subject is required' })}
              className="w-full rounded-lg bg-[#b5a6d0] text-purple-950 placeholder-fuchsia-50 focus:border-[#200053] focus:ring-2 focus:ring-[#200053]-light px-4 py-3"
            />
            {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>}
          </div>
          <div>
            <textarea
              placeholder="Message"
              rows={5}
              {...register('message', { required: 'Message is required' })}
              className="w-full rounded-lg bg-[#b5a6d0] text-purple-950 placeholder-fuchsia-50 focus:border-[#200053] focus:ring-2 focus:ring-[#200053]-light px-4 py-3 resize-none"
            />
            {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#200053] text-white font-semibold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send Inquiry'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
