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
    inputClassName = "text-lg",
    dropdownDirection = "bottom",
    isDark = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const dropdownRef = useRef(null);

    // Theme-based internal colors
    const colors = {
        text: isDark ? 'text-secondary' : 'text-white',
        placeholder: isDark ? 'placeholder:text-secondary/40' : 'placeholder:text-white/30',
        dropdownBtnBorder: isDark ? 'border-secondary/10' : 'border-white/10',
        dropdownBtnHover: 'hover:bg-black/5',
        dropdownIcon: isDark ? 'text-secondary/60' : 'text-primary'
    };

    // Value parsing and syncing
    useEffect(() => {
        if (!value) {
            setPhoneNumber('');
            return;
        }

        const currentFullPhone = `${selectedCountry.code}${phoneNumber.replace(/\D/g, '')}`;
        const newValueDigits = value.replace(/\D/g, '');
        const currentFullDigits = currentFullPhone.replace(/\D/g, '');

        if (newValueDigits !== currentFullDigits) {
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
        const val = e.target.value.replace(/[^\d\s]/g, '');
        setPhoneNumber(val);
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
        <div className={`relative flex items-stretch rounded-2xl transition-all duration-500 overflow-visible border shadow-sm ${isDark ? 'bg-gray-50 border-gray-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10' : 'bg-white/[0.03] border-white/10 focus-within:bg-white/[0.08] focus-within:ring-4 focus-within:ring-primary/20 focus-within:border-primary/40'} ${className}`}>
            <div className="relative group/dropdown" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`h-full flex items-center space-x-3 px-6 border-r ${colors.dropdownBtnBorder} ${colors.dropdownBtnHover} transition-all min-w-[130px] group-hover/dropdown:bg-black/5`}
                >
                    <span className="text-2xl leading-none drop-shadow-sm">{selectedCountry.flag}</span>
                    <span className={`font-bold ${colors.text} text-sm tracking-widest`}>{selectedCountry.code}</span>
                    <ChevronDown size={14} className={`${colors.dropdownIcon} transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: dropdownDirection === 'top' ? 10 : -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: dropdownDirection === 'top' ? 10 : -10 }}
                            className={`absolute z-[1000] w-[320px] bg-white rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-gray-100 py-3 ${dropdownDirection === 'top' ? 'bottom-full mb-4' : 'top-full mt-4'} left-0 overflow-hidden backdrop-blur-xl`}
                        >
                            <div className="max-h-[380px] overflow-y-auto custom-scrollbar px-2">
                                {COUNTRIES.map((c, idx) => {
                                    const isSelected = selectedCountry.name === c.name && selectedCountry.code === c.code;
                                    return (
                                        <button
                                            key={`${c.code}-${idx}`}
                                            type="button"
                                            onClick={() => selectCountry(c)}
                                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl mb-1 transition-all ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-secondary hover:bg-gray-50'}`}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="w-5 flex justify-center">
                                                    {isSelected && <Check size={18} className="text-white" strokeWidth={3} />}
                                                </div>
                                                <span className="text-2xl leading-none">{c.flag}</span>
                                                <span className={`text-sm tracking-wide ${isSelected ? 'font-bold' : 'font-medium'}`}>{c.name}</span>
                                            </div>
                                            <span className={`text-xs font-bold tracking-tighter ${isSelected ? 'text-white/90' : 'text-primary/60'}`}>{c.code}</span>
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
                className={`flex-1 w-full min-w-0 px-7 py-5 bg-transparent border-none focus:outline-none ${colors.text} ${colors.placeholder} tracking-[0.08em] font-semibold text-lg ${inputClassName} transition-all`}
            />
        </div>
    );
};

export default PhoneInput;
