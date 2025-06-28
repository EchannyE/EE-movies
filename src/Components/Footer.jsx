import React from 'react';
import { Link } from 'react-router-dom'; // Assuming react-router-dom is used for navigation
import { BiLogoFacebook, } from "react-icons/bi";
import { BiLogoInstagram } from "react-icons/bi";
import { BiLogoLinkedin } from "react-icons/bi";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-950 text-white py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-700">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                {/* Copyright Information */}
                <div className="text-center md:text-left text-gray-400">
                    <p>&copy; {currentYear} De Elite Movies. All rights reserved.</p>
                    <p className="text-sm mt-1">Designed with passion for movie lovers.</p>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm">
                    
                    <Link to="/privacy" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                        Privacy Policy
                    </Link>  
                    <Link to="/terms" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                        Terms of Service
                    </Link>
                </div>

                {/* Social Media Links */}
                <div className="flex justify-center md:justify-end space-x-4">
                    <a href="https://www.facebook.com/share/1C9vDUJ5qP/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200" aria-label="Facebook">
                        <BiLogoFacebook />
                    </a>
                    
                    <a href="https://www.instagram.com/echannyonda?igsh=MTcwdmE3ZnB2cHN5dA==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200" aria-label="Instagram">
                       <BiLogoInstagram />
                    </a>
                    <a href="http://www.linkedin.com/in/echannyidagu" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200" aria-label="LinkedIn">
                        <BiLogoLinkedin />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
