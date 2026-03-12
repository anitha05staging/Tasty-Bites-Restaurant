import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search } from 'lucide-react';

const COUNTRIES = [
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+1', name: 'Canada', flag: '🇨🇦' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: '+34', name: 'Spain', flag: '🇪🇸' },
    { code: '+351', name: 'Portugal', flag: '🇵🇹' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: '+353', name: 'Ireland', flag: '🇮🇪' },
    { code: '+64', name: 'New Zealand', flag: '🇳🇿' },
    { code: '+65', name: 'Singapore', flag: '🇸🇬' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
];

const PhoneInput = ({ 
    value, 
    onChange, 
    placeholder = "20 7946 0123", 
    required = false, 
    className = "", 
    containerClassName = "bg-gray-50 border border-gray-200 focus-within:ring-primary/20 focus-within:bg-white",
    inputClassName = "text-lg",
    dropdownDirection = "bottom" 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const dropdownRef = useRef(null);

    // Value parsing and syncing
    useEffect(() => {
        if (!value) {
            setPhoneNumber('');
            return;
        }

        const currentFullPhone = `${selectedCountry.code}${phoneNumber.replace(/\D/g, '')}`;
        const newValueDigits = value.replace(/\D/g, '');
        const currentFullDigits = currentFullPhone.replace(/\D/g, '');

        // Only update if the stripped values are actually different
        if (newValueDigits !== currentFullDigits) {
            // Sort by code length descending to match longest code first (e.g. +44 before +4)
            const sortedCountries = [...COUNTRIES].sort((a, b) => b.code.length - a.code.length);
            const countryMatch = sortedCountries.find(c => value.startsWith(c.code));
            if (countryMatch) {
                setSelectedCountry(countryMatch);
                setPhoneNumber(value.replace(countryMatch.code, '').trim());
            } else {
                setPhoneNumber(value);
            }
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePhoneChange = (e) => {
        // Allow spaces and digits
        const val = e.target.value.replace(/[^\d\s]/g, '');
        setPhoneNumber(val);
        // Clean value for API (digits only)
        const cleanVal = val.replace(/\D/g, '');
        onChange(`${selectedCountry.code}${cleanVal}`);
    };

    const selectCountry = (country) => {
        setSelectedCountry(country);
        setIsOpen(false);
        const cleanVal = phoneNumber.replace(/\D/g, '');
        onChange(`${country.code}${cleanVal}`);
    };

    return (
        <div className={`relative flex items-center rounded-xl transition-all overflow-visible ${containerClassName} ${className}`}>
            <div className="relative h-full" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="h-full flex items-center space-x-2 px-4 py-3 border-r border-gray-200 hover:bg-gray-100/50 transition-colors min-w-[110px]"
                >
                    <span className="text-xl leading-none">{selectedCountry.flag}</span>
                    <span className="font-medium text-secondary text-base">{selectedCountry.code}</span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: dropdownDirection === 'top' ? 10 : -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: dropdownDirection === 'top' ? 10 : -10, scale: 0.95 }}
                            className={`absolute ${dropdownDirection === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 w-[300px] bg-white rounded-2xl shadow-premium border border-gray-100 z-[100] py-2`}
                        >
                            <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                                {COUNTRIES.map((c, idx) => {
                                    const isSelected = selectedCountry.name === c.name && selectedCountry.code === c.code;
                                    return (
                                        <button
                                            key={`${c.code}-${idx}`}
                                            type="button"
                                            onClick={() => selectCountry(c)}
                                            className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${isSelected ? 'bg-primary text-white' : 'text-secondary hover:bg-gray-50'}`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-5 flex justify-center">
                                                    {isSelected && <Check size={16} className="text-white" />}
                                                </div>
                                                <span className="text-xl leading-none">{c.flag}</span>
                                                <span className={`text-sm ${isSelected ? 'font-semibold' : 'font-medium'}`}>{c.name}</span>
                                            </div>
                                            <span className={`text-sm ${isSelected ? 'text-white/90' : 'text-[#64748b]'}`}>{c.code}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <input
                type="tel"
                required={required}
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder={placeholder}
                className={`flex-1 w-full min-w-0 px-5 py-3 bg-transparent border-none focus:outline-none text-secondary placeholder:text-gray-400 tracking-wide ${inputClassName}`}
            />
        </div>
    );
};

export default PhoneInput;
