import { Card } from "@/components/ui/card";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-0 sm:py-16">
      <Card className="border-none bg-teal-400/60 shadow-none rounded-none sm:rounded-4xl overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Tally Cash Pro</h3>
            <p className="mb-4">
              1336, AL Saqr Business Tower, Sheikh Zayed Road, Dubai
            </p>
            <p>info@tallycashpro.com</p>
            {/* <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-blue-400">
                Facebook
              </a>
              <a href="#" className="hover:text-blue-400">
                Twitter
              </a>
              <a href="#" className="hover:text-blue-400">
                Instagram
              </a>
            </div> */}
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-400">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-400">
                  Features Overview
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-400">
                  Financial Guides
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400">
                  Budgeting Tips
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400">
                  Savings Calculator
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p>© {currentYear}. All Rights Reserved. &nbsp;</p>
          {/* <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-400">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-400">
              Terms and Conditions
            </a>
          </div> */}
        </div>
      </Card>
    </footer>
  );
}
