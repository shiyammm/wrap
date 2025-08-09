import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { predefinedMessages, WrappingOptions } from "@/constants";
import clsx from "clsx";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";

interface GiftProps {
    wrappingOption: string;
    setWrappingOption: Dispatch<SetStateAction<string>>;
    showMessageBox: boolean;
    message: string;
    setMessage: Dispatch<SetStateAction<string>>;
}

const GiftWrap = ({
    wrappingOption,
    setWrappingOption,
    showMessageBox,
    message,
    setMessage
}: GiftProps) => {
    return (
        <div className="space-y-5">
            <Label>Select Gift Wrapping</Label>
            <RadioGroup
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                value={wrappingOption}
                onValueChange={(value) => setWrappingOption(value)}
            >
                {WrappingOptions.map((option) => (
                    <div
                        key={option.id}
                        className={clsx(
                            "relative rounded-lg overflow-hidden border transition cursor-pointer",
                            option.id == wrappingOption
                                ? "border-wrap-orange-dull ring-2 ring-wrap-orange-dull"
                                : "border-muted hover:border-wrap-orange"
                        )}
                    >
                        <RadioGroupItem
                            value={option.id}
                            className={`hidden`}
                            id={option.id}
                        />
                        <label
                            htmlFor={option.id}
                            className="block cursor-pointer"
                        >
                            <Image
                                src={option.image}
                                alt={option.name}
                                width={300}
                                height={300}
                                className="w-full h-32 object-cover"
                            />
                            <div className="text-center py-2 text-[0.8rem] font-medium">
                                {option.name}
                            </div>
                        </label>
                    </div>
                ))}
            </RadioGroup>

            {showMessageBox && (
                <div className="space-y-2">
                    <Label>Gift Message</Label>
                    <Textarea
                        placeholder="Write your personal message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                    />

                    <div className="flex gap-2 flex-wrap mt-2">
                        {predefinedMessages.map((msg, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setMessage(msg)}
                                className="text-sm bg-muted px-3 py-1.5 rounded hover:bg-accent"
                            >
                                {msg}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <Label>Gift Wrapping</Label>
                <Select
                    value={wrappingOption}
                    onValueChange={(value) => setWrappingOption(value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a wrapping option" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">
                            🎁 No Wrapping (Free)
                        </SelectItem>
                        <SelectItem value="basic">
                            ✨ Basic Wrap - ₹20
                        </SelectItem>
                        <SelectItem value="premium">
                            🌟 Premium Wrap with Ribbon - ₹50
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default GiftWrap;
