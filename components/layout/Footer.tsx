'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-3 border-black bg-brutalist-bg mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-b-3 border-black">
          {/* Section 1 */}
          <div className="p-6 border-r-3 border-black border-b-3 md:border-b-0">
            <h4 className="text-sm font-bold uppercase mb-4 tracking-widest">Product</h4>
            <div className="flex flex-col gap-3">
              <Link href="#" className="text-xs mono-text hover:underline">
                Repositories
              </Link>
              <Link href="#" className="text-xs mono-text hover:underline">
                Documentation
              </Link>
              <Link href="#" className="text-xs mono-text hover:underline">
                API Reference
              </Link>
              <Link href="#" className="text-xs mono-text hover:underline">
                CLI
              </Link>
            </div>
          </div>

          {/* Section 2 */}
          <div className="p-6 border-r-3 border-black border-b-3 md:border-b-0">
            <h4 className="text-sm font-bold uppercase mb-4 tracking-widest">Community</h4>
            <div className="flex flex-col gap-3">
              <Link href="#" className="text-xs mono-text hover:underline">
                Forum
              </Link>
              <Link href="#" className="text-xs mono-text hover:underline">
                Discussions
              </Link>
              <Link href="#" className="text-xs mono-text hover:underline">
                Contributing
              </Link>
              <Link href="#" className="text-xs mono-text hover:underline">
                Code of Conduct
              </Link>
            </div>
          </div>

          {/* Section 3 */}
          <div className="p-6 border-r-3 border-black border-b-3 md:border-b-0">
            <h4 className="text-sm font-bold uppercase mb-4 tracking-widest">Company</h4>
            <div className="flex flex-col gap-3">
              <Link href="#" className="text-xs mono-text hover:underline">
                About
              </Link>
              <Link href="#" className="text-xs mono-text hover:underline">
                Blog
              </Link>
              <Link href="#" className="text-xs mono-text hover:underline">
                Status
              </Link>
              <Link href="#" className="text-xs mono-text hover:underline">
                Contact
              </Link>
            </div>
          </div>

          {/* Section 4 */}
          <div className="p-6">
            <h4 className="text-sm font-bold uppercase mb-4 tracking-widest">Legal</h4>
            <div className="flex flex-col gap-3">
              <Link href="#" className="text-xs mono-text hover:underline">
                Privacy
              </Link>
              <Link href="#" className="text-xs mono-text hover:underline">
                Terms
              </Link>
              <Link href="#" className="text-xs mono-text hover:underline">
                Security
              </Link>
              <Link href="#" className="text-xs mono-text hover:underline">
                Cookies
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="px-6 py-8 flex items-center justify-between">
          <div>
            <p className="text-xs mono-text font-bold uppercase mb-2">GITNODE</p>
            <p className="text-xs mono-text">
              © 2024 GITNODE. Build in public. Raw version control.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href="#"
              className="p-2 border-2 border-black hover:bg-black hover:text-white transition-brutal"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="#"
              className="p-2 border-2 border-black hover:bg-black hover:text-white transition-brutal"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              className="p-2 border-2 border-black hover:bg-black hover:text-white transition-brutal"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;