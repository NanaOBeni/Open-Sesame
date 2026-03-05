import * as dotenv from "dotenv";
dotenv.config();

// Rule 1
export function uppercase_exist(str: string): boolean {
    const has_capital = /[A-Z]/.test(str);

    if (has_capital) {
        return true;
    }

    return false;
}

// Rule 2
export function special_exist(str: string): boolean {
    const has_special = /[^A-Za-z0-9 ]/.test(str);

    if (has_special) {
        return true;
    }

    return false;
}

// Rule 3
export function minimum_8(str: string): boolean {
    if (str.length >= 8) {
        return true;
    }

    return false;
}

// Rule 4
export function greek_exist(str: string): boolean {
    const has_greek = /\p{Script=Greek}/u.test(str);
    
    if (has_greek) {
        return true;
    }

    return false;
}

// Rule 5
export function country_exist(str: string, country: string): boolean {
    const regex = new RegExp(country, "i");
    const has_country = regex.test(str);
    
    if (has_country) {
        return true;
    }

    return false;
}


//rule 11, time in seconds
export async function video_exist(str: string, time_to_match: number): Promise<boolean> {
    function iso_to_sec(iso_string: string): number {
        const match = iso_string.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        let time = 0;
        if (match[1] != undefined) {
            time += 3600 * Number(match[1]);
        }
        if (match[2] != undefined) {
            time += 60 * Number(match[2]);
        }
        if (match[3] != undefined) {
            time += Number(match[3]);
        }
        console.log("time: ", time);
        return time;
    }

    // OBS!!! Expects the id to be last in the string
    const video_id = str.slice(-11);
    console.log("video_id: ", video_id);

    const url = `https://www.googleapis.com/youtube/v3/videos?id=${video_id}&part=contentDetails&key=${process.env.YOUTUBE_API_KEY}`;
    console.log("url: ", url);
    
    const response = await fetch(url);
    console.log("response: ", response);
    const json = await response.json();
    console.log("json: ", json);

    if (!json.items || json.items.length === 0) {
        console.log("if check was called!")
        return false;
    }

    const time_iso_8601 = json.items[0].contentDetails.duration;
    console.log("time_iso", time_iso_8601);

    const time = iso_to_sec(time_iso_8601);

    return time_to_match === time;
}


