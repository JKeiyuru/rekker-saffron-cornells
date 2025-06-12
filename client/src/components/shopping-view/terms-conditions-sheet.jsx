/* eslint-disable no-unused-vars */
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileTextIcon } from "lucide-react";

const TermsAndConditionsSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <FileTextIcon className="w-4 h-4" />
          Terms & Conditions
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>Terms and Conditions</SheetTitle>
          <SheetDescription>
            By using our website and services, you agree to these terms and conditions.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-3">1. Acceptance of Terms</h3>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using this website, you accept and agree to be bound by these Terms and Conditions. 
                If you do not agree to abide by these terms, please do not use this service. Your continued use of 
                our website constitutes your acceptance of these terms and any modifications we may make to them.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">2. Company Information</h3>
              <p className="text-gray-700 leading-relaxed">
                This website is operated by a family-run toy business based in Kenya. We are committed to providing 
                quality toys and educational products while complying with all applicable Kenyan laws and regulations, 
                including the Consumer Protection Act, 2012, and Data Protection Act, 2019.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">3. Product Information and Availability</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                We strive to ensure that all product information on our website is accurate. However, we do not 
                warrant that product descriptions or other content is error-free, complete, or current.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Product availability is subject to change without notice</li>
                <li>We reserve the right to discontinue any product at any time</li>
                <li>Prices are subject to change without prior notice</li>
                <li>All prices are displayed in Kenyan Shillings (KES) unless otherwise stated</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">4. Orders and Payment</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                When you place an order, you are making an offer to purchase products subject to these terms:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>All orders are subject to acceptance and availability</li>
                <li>We reserve the right to refuse or cancel any order</li>
                <li>Payment must be made in full before dispatch of goods</li>
                <li>We accept various payment methods as displayed at checkout</li>
                <li>All transactions are processed securely through encrypted payment gateways</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">5. Delivery and Shipping</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                We deliver within Kenya and strive to meet estimated delivery times:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Delivery times are estimates and not guaranteed</li>
                <li>Risk of loss passes to you upon delivery</li>
                <li>We are not liable for delays caused by third-party delivery services</li>
                <li>Delivery charges will be clearly displayed before order confirmation</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">6. Returns and Refunds</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                In accordance with the Consumer Protection Act, 2012:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>You may return products within 7 days of receipt if they are defective or not as described</li>
                <li>Products must be returned in original condition and packaging</li>
                <li>Custom or personalized items may not be returnable</li>
                <li>Return shipping costs may apply unless the item is defective</li>
                <li>Refunds will be processed within 14 days of receiving returned items</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">7. Data Protection and Privacy</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                In compliance with Kenya&apos;s Data Protection Act, 2019:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>We collect and process personal data only as necessary for our services</li>
                <li>Your data is stored securely and not shared with third parties without consent</li>
                <li>You have the right to access, correct, or delete your personal data</li>
                <li>We use cookies to improve user experience</li>
                <li>Our full Privacy Policy is available separately</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">8. Intellectual Property</h3>
              <p className="text-gray-700 leading-relaxed">
                All content on this website, including text, graphics, logos, images, and software, is protected 
                by intellectual property rights and is owned by us or our licensors. You may not reproduce, 
                distribute, or create derivative works without our express written permission.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">9. User Conduct</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Use the website for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the website&apos;s operation</li>
                <li>Upload malicious code or content</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">10. Limitation of Liability</h3>
              <p className="text-gray-700 leading-relaxed">
                Subject to applicable law, our liability is limited to the maximum extent permitted. We are not 
                liable for indirect, incidental, or consequential damages. Our total liability shall not exceed 
                the amount you paid for the specific product or service in question.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">11. Age Restrictions</h3>
              <p className="text-gray-700 leading-relaxed">
                Our website is intended for users 18 years and older. Minors may use the website only with 
                parental supervision and consent. Parents are responsible for monitoring their children&apos;s 
                online activities and purchases.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">12. Governing Law</h3>
              <p className="text-gray-700 leading-relaxed">
                These terms are governed by the laws of Kenya. Any disputes will be subject to the exclusive 
                jurisdiction of Kenyan courts. We comply with all applicable Kenyan regulations including 
                consumer protection and data privacy laws.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">13. Changes to Terms</h3>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be posted on this page 
                with an updated effective date. Your continued use of the website after changes are posted 
                constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">14. Contact Information</h3>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us through the 
                contact information provided on our website. We are committed to addressing your concerns 
                and ensuring compliance with all applicable laws.
              </p>
            </section>

            <section className="border-t pt-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong>Last Updated:</strong> June 2025<br/>
                <strong>Effective Date:</strong> June 2025<br/>
                By continuing to use this website, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default TermsAndConditionsSheet;