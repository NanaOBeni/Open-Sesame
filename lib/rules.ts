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
//rule 6
//remap keys. CALL ONLY ONCE.
function remapKeys(text: string, is_on_page: boolean = false): string {
    let text_compare: string = "";
    const segments: string[] = Array.from(text);
    const counter_arr: number[] = [];
    const letters_arr: string[] = [];
    
    //count how often each letter appears in a text
    for (let i = 0; i < segments.length; i++) {
        if (!letters_arr.includes(segments[i]!)) {
            counter_arr[letters_arr.length] = 1;
            letters_arr[letters_arr.length] = segments[i]!;
        } else {
            counter_arr[letters_arr.indexOf(segments[i]!)]!++;
        }
    }
    //in case of ties, the char that appeared first will win. 
    const sorted = counter_arr.slice().sort((a, b) => (b - a));
    let mst_lttr =      letters_arr[counter_arr.indexOf(sorted[0]!)]!;
    let scnd_mst_lttr = letters_arr[counter_arr.indexOf(sorted[1]!)]!;
    let thrd_mst_lttr = letters_arr[counter_arr.indexOf(sorted[2]!)]!;

    const out: string[] = segments.slice();
    let top3letters: string[] = [mst_lttr, scnd_mst_lttr, thrd_mst_lttr];

    //internally rotate all instances of charcters from the set of top 3 characters.
    for(let i = 0; i < out.length; i++) {
        if (top3letters.includes(out[i]!)) {
            out[i] = top3letters[(top3letters.indexOf(out[i]!) + 1) % 3]!;
        }
    }

    //remap inputs from the user so that the filter described above is continously reapplied
    //finds the first input box in the webpage (and assumes such an element can only be not null)
    // while on page, *THE* call to this func will need a true following the text argument.
    //this is because the 'document' doesn't exist while not on the page.
    if (is_on_page) {

        const input_element = document.getElementById('input') as HTMLInputElement;
        input_element.addEventListener('keydown', (e: KeyboardEvent) => {
            // Mapping: Pressing mst_letter will output scnd_mst_lttr
            const keyMap: { [key: string]: string } = {
                mst_lttr: scnd_mst_lttr,
                scnd_mst_lttr: thrd_mst_lttr,
                thrd_mst_lttr: mst_lttr
            };
            if (keyMap[e.key]) {
                e.preventDefault(); // Stop the original character from appearing
                const new_char = keyMap[e.key];
                
                // Insert the new character at the cursor position
                const start = input_element.selectionStart || 0;
                const end = input_element.selectionEnd || 0;
                const value = input_element.value;
                input_element.value = value.slice(0, start) + new_char + value.slice(end);
                
                // Move cursor forward
                input_element.selectionStart = input_element.selectionEnd = start + 1;
            }
        });
    }
    text_compare = out.join('');
    return out.join('');
} 
// Rule 7
//have one of the devs names in your password
function contain_dev(str:string):boolean {
    //if any of the following searches return is at least 0, return true. ow return false
    const devs: Array<number> = [str.search(/Isaac/i), str.search(/Isak/i), str.search(/Felix/i)];
    return !devs.every(x => x === -1);
}
//Rule 9 
//text argument is needed only for test cases. fire argument is so it can adapt to the systems relevant fire emoji
function wildFire(text: string, fire: string = "🔥", is_on_page: boolean = false): string {
    const segments: string[] = Array.from(text);
    
    let out: Array<string> = segments.slice();
    //segments.length is equal to the length of current password
    if (out.includes(fire)) {
        testCaseHelper();
    }

    if(is_on_page) {
        const input_element = document.getElementById('input') as HTMLInputElement;
        
        let spontanous_combustion = randomInt(out.length)
        
        out[spontanous_combustion] = fire;
        input_element.value = out.join('');
        
        while(input_element.value.includes(fire)) {
            for (let i = 0; i < input_element.value.length; i++) {
                if (input_element.value[i] === fire) {
                    out = Array.from(input_element.value);
                    //body apparently ok to do inline if it is specifically a single statement
                    //(e.g, not a declaration or multiple statements)
                    if (i > 0 && out[i - 1] !== fire) out[i - 1] = fire;
                    if (i + 1 < input_element.value.length && out[i + 1] !== fire) out[i + 1] = fire;
                    input_element.value = out.join('');
                }
            }
            setTimeout( () => null, 750);
        }
    }
    
    function testCaseHelper(): void {  
        for (let i = 0; i < segments.length; i++) {
            if (segments[i] === fire) {
                //body apparently ok to do inline if it is specifically a single statement
                //(e.g, not a declaration or multiple statements)
                if (i > 0 && out[i - 1] !== fire) out[i - 1] = fire;
                if (i + 1 < segments.length && out[i + 1] !== fire) out[i + 1] = fire;
            }
        }
    }

    return out.join('');

}
//rule 11, time in seconds
export function video_exist(str: string, time_to_match): boolean {
    // OBS!!! Expects the id to be last in the string
    function get_video_id(): string {
           const last_11 = str.slice(-11);
           return last_11;
    }

    function iso_to_sec(iso_string: string): number {
        const match = iso_string.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        let time = 0;
        if (match[1] != undefined) {
            time += 3600 * match[1];
        }
        if (match[2] != undefined) {
            time += 60 * match[2];
        }
        if (match[3] != undefined) {
            time += match[3];
        }

        return time;
    }

    const video_id = get_video_id();

    const url = `https://www.googleapis.com/youtube/v3/videos?id=${video_id}&part=contentDetails&key=${YOUTUBE_API_KEY}`;
    
    const response = await fetch(url);
    const json = await response.json();

    const time_iso_8601 = json.items[0].contentDetails.duration;

    const time = iso_to_sec(time_iso_8601);

    return time;
}


