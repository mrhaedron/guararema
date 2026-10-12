//! Núcleo de movimento sem dependências. Coordenadas em metros.
#[no_mangle]
pub extern "C" fn movement_axis(axis: f32, other: f32, sprint: i32, dt: f32) -> f32 {
    let length = (axis * axis + other * other).sqrt().max(1.0);
    axis / length * if sprint != 0 { 6.0 } else { 3.2 } * dt.clamp(0.0, 0.05)
}
#[no_mangle]
pub extern "C" fn can_walk(x: f32, z: f32) -> i32 {
    (x > -48.0 && x < 48.0 && z > -110.0 && z < 55.0) as i32
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn diagonals_have_same_speed() {
        let straight = movement_axis(1., 0., 0, 0.05);
        let diagonal = movement_axis(1., 1., 0, 0.05);
        assert!((diagonal * 2f32.sqrt() - straight).abs() < 0.0001);
    }
    #[test] fn world_limits() { assert_eq!(can_walk(0., 0.), 1); assert_eq!(can_walk(49., 0.), 0); }
}
