
import {
    ShieldCheck,
    MapPin,
    Mail,
    Heart,
    Code2,
    BriefcaseBusiness,
    ArrowUpRight,
} from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#0E1B3D] text-white">
            <div className="mx-auto max-w-7xl px-6 pt-14 pb-8">

                {/* Top Section */}
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

                    {/* Brand */}
                    <div>
                        <a href="#top" className="mb-4 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1F3FBF]">
                                <ShieldCheck size={25} />
                            </div>
                            <span className="text-2xl font-bold">
                                Safe<span className="text-[#5D8BFF]">Signal</span>
                            </span>
                        </a>

                        <p className="max-w-xs text-sm leading-6 text-blue-100/70">
                            Your journey, your privacy, your peace of mind.
                            Stay connected with the people who care about you.
                        </p>

                        <div className="mt-5 flex items-center gap-2 text-sm text-emerald-300">
                            <ShieldCheck size={17} />
                            Privacy comes first
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="mb-5 text-base font-semibold">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-blue-100/70">
                            <li>
                                <a href="#top" className="transition hover:text-white">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#planner" className="transition hover:text-white">
                                    Plan a Journey
                                </a>
                            </li>
                            <li>
                                <a href="#journey" className="transition hover:text-white">
                                    Check-ins
                                </a>
                            </li>
                            <li>
                                <a href="#simulator" className="transition hover:text-white">
                                    Practice Scenarios
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Safety */}
                    <div>
                        <h3 className="mb-5 text-base font-semibold">Your Safety</h3>
                        <ul className="space-y-3 text-sm text-blue-100/70">
                            <li>
                                <a href="#privacy" className="transition hover:text-white">
                                    Privacy Settings
                                </a>
                            </li>
                            <li>
                                <a href="#help" className="transition hover:text-white">
                                    Help & Support
                                </a>
                            </li>
                            <li>
                                <a href="mailto:support@safesignal.example" className="transition hover:text-white">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-5 text-base font-semibold">Stay Connected</h3>

                        <p className="mb-4 text-sm leading-6 text-blue-100/70">
                            Have a suggestion or need help? We would love to hear from you.
                        </p>

                        <a
                            href="mailto:support@safesignal.example"
                            className="inline-flex items-center gap-2 text-sm text-blue-200 transition hover:text-white"
                        >
                            <Mail size={17} />
                            Contact Support
                            <ArrowUpRight size={15} />
                        </a>

                        <div className="mt-5 flex gap-3">
                            <a
                                href="https://github.com/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub"
                                className="rounded-lg border border-white/10 p-2.5 transition hover:bg-white/10"
                            >
                                <Code2 size={19} />
                            </a>

                            <a
                                href="https://linkedin.com/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="LinkedIn"
                                className="rounded-lg border border-white/10 p-2.5 transition hover:bg-white/10"
                            >
                                <BriefcaseBusiness size={19} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Privacy Banner */}
                <div className="mt-12 flex flex-col gap-3 rounded-2xl border border-blue-300/15 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <MapPin className="mt-1 shrink-0 text-emerald-300" size={20} />
                        <div>
                            <p className="text-sm font-semibold">
                                Your journey stays private.
                            </p>
                            <p className="mt-1 text-xs leading-5 text-blue-100/60">
                                Designed to keep trusted contacts informed without continuous
                                location tracking.
                            </p>
                        </div>
                    </div>

                    <a
                        href="#privacy"
                        className="shrink-0 text-sm font-medium text-blue-300 transition hover:text-white"
                    >
                        Learn about privacy →
                    </a>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-center sm:flex-row sm:text-left">
                    <p className="text-xs text-blue-100/50">
                        © {new Date().getFullYear()} SafeSignal. All rights reserved.
                    </p>

                    <p className="flex items-center gap-1.5 text-xs text-blue-100/60">
                        Made with <Heart size={13} className="text-rose-400" /> for safer
                        journeys
                    </p>

                    <div className="flex gap-5 text-xs text-blue-100/60">
                        <a href="#privacy" className="transition hover:text-white">
                            Privacy
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
